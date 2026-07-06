import React, { useEffect, useRef, useState } from "react";
import { shortenAddress } from "../../lib";
import { decryptLegacyV1 } from "../../lib/keystore/legacyV1";
import { exportModern, importModern } from "../../lib/keystore/modern";
import { mnemonicToSigner } from "../../lib/keystore/account";
import {
  setKeystoreSigner,
  getKeystoreSigner,
  clearKeystoreSigner,
} from "../../lib/keystore/keystoreStore";
import {
  isPrfSupported,
  enrollPasskey,
  unlockPasskey,
  PrfUnsupportedError,
} from "../../lib/keystore/passkey";
import {
  savePasskeyKeystore,
  loadPasskeyKeystore,
} from "../../lib/keystore/persist";
import { downloadModernKeystore } from "../../lib/keystore/download";

const KEYSTORE_WALLET_NAME = "keystore-wallet";
const BACKUP_FILENAME = "assetmantle-keystore-modern.json";

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(reader.error || new Error("Could not read file."));
    reader.readAsText(file);
  });
}

// legacy V1 files carry hashpwd+salt+crypted; the modern cosmjs export
// carries type+kdf (see lib/keystore/legacyV1.js and modern.js).
function detectKeystoreShape(json) {
  if (json && json.hashpwd && json.salt && json.crypted) return "legacy";
  if (json && json.type && json.kdf) return "modern";
  return null;
}

// Real keystore connect/import/export/passkey sub-flow, opened from
// ConnectModal.jsx in place of the old "Go to Old Wallet for Keystore" link.
// Steps: menu (upload or unlock-with-passkey) -> upload -> password ->
// [legacy only] forced upgrade-download -> success (download / enable
// passkey). Every async primitive here is a prior, unit-tested module
// (legacyV1/modern/account/keystoreStore/passkey/persist/download); this
// component only sequences them and is build-verified - the interactive
// walk-through is the manual browser pass in Task 6.
export default function KeystoreConnect({ walletRepo, onBack, onClose }) {
  const [step, setStep] = useState("menu");
  const [busy, setBusy] = useState(false);
  const [menuError, setMenuError] = useState(null);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [savedPasskey, setSavedPasskey] = useState(null);

  const [fileText, setFileText] = useState(null);
  const [fileJson, setFileJson] = useState(null);
  const [shape, setShape] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const [legacyMnemonic, setLegacyMnemonic] = useState(null);
  const [unlockSecret, setUnlockSecret] = useState(null);
  const [upgradeError, setUpgradeError] = useState(null);
  const upgradeBlobRef = useRef(null);
  const upgradeTriggered = useRef(false);

  const [address, setAddress] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [passkeyBusy, setPasskeyBusy] = useState(false);

  // Passkey availability + a previously-enrolled record (if any) only need
  // checking once per mount of this sub-flow.
  useEffect(() => {
    let cancelled = false;
    isPrfSupported().then((supported) => {
      if (!cancelled) setPasskeyAvailable(supported);
    });
    setSavedPasskey(loadPasskeyKeystore());
    return () => {
      cancelled = true;
    };
  }, []);

  // "force" the upgrade download: fire it the moment the step is entered,
  // not gated behind an extra click. upgradeTriggered guards against a
  // second auto-fire (e.g. React StrictMode's double-invoke in dev).
  useEffect(() => {
    if (step !== "legacyUpgrade" || upgradeTriggered.current) return;
    upgradeTriggered.current = true;
    (async () => {
      try {
        const blob = await exportModern(legacyMnemonic, unlockSecret);
        upgradeBlobRef.current = blob;
        downloadModernKeystore(blob, BACKUP_FILENAME);
      } catch {
        setUpgradeError(
          "Could not prepare the upgraded keystore file automatically. Use the button below to try again."
        );
      }
    })();
  }, [step, legacyMnemonic, unlockSecret]);

  function handleBack() {
    if (step === "menu") {
      onBack();
      return;
    }
    if (step === "upload" || step === "password") {
      setStep("menu");
      setUploadError(null);
      setPasswordError(null);
    }
  }

  // Shared by every unlock path (legacy, modern-file, passkey): sets the
  // in-memory signer first, then drives the real cosmos-kit connect for the
  // registered keystore wallet. Returns an error string on failure (never
  // throws), and always clears the in-memory signer again on failure so a
  // half-connected keystore never lingers.
  async function connectKeystoreWallet(signer, addr) {
    setKeystoreSigner(signer, addr);
    const wallet = walletRepo?.wallets.find(
      (w) => w.walletName === KEYSTORE_WALLET_NAME
    );
    if (!wallet) {
      clearKeystoreSigner();
      return "Keystore wallet is not registered. Refresh the page and try again.";
    }
    await wallet.connect();
    if (wallet.isError) {
      clearKeystoreSigner();
      return wallet.message || "Could not connect the keystore wallet.";
    }
    return null;
  }

  async function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file after an error
    if (!file) return;
    setUploadError(null);
    try {
      const text = await readFileAsText(file);
      const json = JSON.parse(text);
      const detected = detectKeystoreShape(json);
      if (!detected) {
        setUploadError("This does not look like an AssetMantle keystore file.");
        return;
      }
      setFileText(text);
      setFileJson(json);
      setShape(detected);
      setPassword("");
      setPasswordError(null);
      setStep("password");
    } catch {
      setUploadError(
        "Could not read that file. Make sure it's a valid keystore .json export."
      );
    }
  }

  async function handlePasswordSubmit() {
    if (busy || !password) return;
    setBusy(true);
    setPasswordError(null);
    try {
      if (shape === "legacy") {
        const result = await decryptLegacyV1(fileJson, password);
        if (result.error) {
          setPasswordError(result.error);
          return;
        }
        const { signer, address: addr } = await mnemonicToSigner(
          result.mnemonic
        );
        const err = await connectKeystoreWallet(signer, addr);
        if (err) {
          setPasswordError(err);
          return;
        }
        setLegacyMnemonic(result.mnemonic);
        setUnlockSecret(password);
        setAddress(addr);
        setStep("legacyUpgrade");
      } else {
        let signer;
        try {
          signer = await importModern(fileText, password);
        } catch {
          setPasswordError("Incorrect password.");
          return;
        }
        const [account] = await signer.getAccounts();
        const err = await connectKeystoreWallet(signer, account.address);
        if (err) {
          setPasswordError(err);
          return;
        }
        setUnlockSecret(password);
        setAddress(account.address);
        setStep("success");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleUnlockWithPasskey() {
    const saved = savedPasskey || loadPasskeyKeystore();
    if (!saved || busy) return;
    setBusy(true);
    setMenuError(null);
    try {
      const prfSecretHex = await unlockPasskey({
        credentialId: saved.credentialId,
        prfSalt: saved.prfSalt,
      });
      const signer = await importModern(saved.modernBlob, prfSecretHex);
      const [account] = await signer.getAccounts();
      const err = await connectKeystoreWallet(signer, account.address);
      if (err) {
        setMenuError(err);
        return;
      }
      setUnlockSecret(prfSecretHex);
      setAddress(account.address);
      setStep("success");
    } catch (error) {
      setMenuError(
        error instanceof PrfUnsupportedError
          ? "Passkey unlock isn't supported on this device/browser. Upload your keystore file and use your password instead."
          : "Could not unlock with passkey. Try uploading your keystore file instead."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleManualUpgradeDownload() {
    try {
      let blob = upgradeBlobRef.current;
      if (!blob) {
        blob = await exportModern(legacyMnemonic, unlockSecret);
        upgradeBlobRef.current = blob;
      }
      downloadModernKeystore(blob, BACKUP_FILENAME);
      setUpgradeError(null);
    } catch {
      setUpgradeError(
        "Could not prepare the upgraded keystore file. Please try again."
      );
    }
  }

  async function handleDownloadKeystore() {
    setActionError(null);
    setActionMessage(null);
    const { signer } = getKeystoreSigner();
    if (!signer) {
      setActionError("Keystore is locked. Reconnect and try again.");
      return;
    }
    try {
      const blob = await signer.serialize(unlockSecret);
      downloadModernKeystore(blob, BACKUP_FILENAME);
      setActionMessage("Keystore file downloaded.");
    } catch {
      setActionError("Could not prepare the keystore file for download.");
    }
  }

  // TODO(manual-verify Task 6): this calls the real, already-unit-tested
  // passkey.js/persist.js primitives end-to-end (enroll -> re-serialize ->
  // persist) rather than a fake handler, but the interactive Touch-ID/PRF
  // round trip itself can only be exercised in a real browser.
  async function handleEnablePasskey() {
    if (passkeyBusy) return;
    const { signer } = getKeystoreSigner();
    if (!signer) {
      setActionError("Keystore is locked. Reconnect and try again.");
      return;
    }
    setPasskeyBusy(true);
    setActionError(null);
    setActionMessage(null);
    try {
      // Force a backup download first: never let the account become
      // solely reliant on this browser's localStorage + passkey.
      const backupBlob = await signer.serialize(unlockSecret);
      downloadModernKeystore(backupBlob, BACKUP_FILENAME);

      const { credentialId, prfSalt, prfSecretHex } = await enrollPasskey({
        rpId: window.location.hostname,
        rpName: "AssetMantle Wallet",
        userId: address,
        userName: address,
      });
      const modernBlob = await signer.serialize(prfSecretHex);
      savePasskeyKeystore({ credentialId, prfSalt, modernBlob });
      setActionMessage(
        "Passkey unlock enabled for this browser. A backup keystore file was downloaded too - keep it somewhere safe."
      );
    } catch (error) {
      setActionError(
        error instanceof PrfUnsupportedError
          ? "This device/browser does not support passkey unlock (PRF). Use your password instead."
          : "Could not enable passkey unlock."
      );
    } finally {
      setPasskeyBusy(false);
    }
  }

  const showBack = step === "menu" || step === "upload" || step === "password";
  const title =
    step === "upload"
      ? "Upload Keystore File"
      : step === "password"
      ? "Enter Password"
      : step === "legacyUpgrade"
      ? "Upgrade Your Keystore"
      : step === "success"
      ? "Keystore Connected"
      : "Connect with Keystore";

  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          {showBack && (
            <button type="button" onClick={handleBack}>
              <i className="bi bi-chevron-left" />
            </button>
          )}
          {title}
        </h1>
        <button
          type="button"
          className="btn text-primary body1"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </div>

      {step === "menu" && (
        <div className="d-flex flex-column gap-3 mt-3">
          <p className="text-white-200 caption my-1">
            Import a keystore file to connect
            {passkeyAvailable && savedPasskey
              ? ", or unlock with the passkey you enabled in this browser."
              : "."}
          </p>
          <button
            type="button"
            className="button-secondary py-2 px-4 rounded-2"
            onClick={() => setStep("upload")}
          >
            Upload keystore file
          </button>
          {passkeyAvailable && savedPasskey && (
            <button
              type="button"
              className="button-secondary py-2 px-4 rounded-2"
              disabled={busy}
              onClick={handleUnlockWithPasskey}
            >
              {busy ? "Unlocking..." : "Unlock with passkey"}
            </button>
          )}
          {menuError && <p className="text-error caption">{menuError}</p>}
        </div>
      )}

      {step === "upload" && (
        <>
          <p className="text-white-200 caption my-1 ps-2">
            Upload the .json keystore file you exported from MantleWallet.
          </p>
          <div
            className="d-flex align-items-center justify-content-center border-color-white rounded-0 position-relative mt-4"
            style={{ border: "1px dashed" }}
          >
            <div className="d-flex flex-column text-primary p-3 text-center gap-3">
              <span className="h4 text-primary mx-auto">
                <i className="bi bi-upload" />
              </span>
              <p className="caption text-white">Drop file here</p>
              <p className="caption text-white-200">or</p>
              <div className="button-secondary py-2 px-5 d-flex align-items-center gap-2">
                Browse <i className="bi bi-search" />
              </div>
            </div>
            <input
              type="file"
              className="position-absolute top-0 bottom-0 start-0 end-0"
              accept=".json"
              style={{ opacity: "0" }}
              onChange={handleFileChange}
            />
          </div>
          {uploadError && (
            <p className="text-error caption mt-2">{uploadError}</p>
          )}
        </>
      )}

      {step === "password" && (
        <>
          <p className="text-white-200 caption my-1">
            Enter the password for this keystore file.
          </p>
          {shape === "legacy" && (
            <p className="text-white-200 caption">
              This is an older keystore file. After connecting, we&apos;ll
              download an upgraded version - the old format embeds its own
              decryption key and isn&apos;t safe to keep using.
            </p>
          )}
          <input
            type="password"
            className="am-input w-100 my-3 py-2 px-3 rounded-1 bg-t border-color-white"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
          />
          {passwordError && (
            <p className="text-error caption">{passwordError}</p>
          )}
          <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mt-3">
            <button
              type="button"
              className="button-primary caption py-2 px-5"
              onClick={handlePasswordSubmit}
              disabled={busy || !password}
            >
              {busy ? "Connecting..." : "Confirm"}
            </button>
          </div>
        </>
      )}

      {step === "legacyUpgrade" && (
        <div className="d-flex flex-column gap-3 mt-3">
          <p className="d-flex align-items-start gap-1 text-error">
            <span className="mt-1">
              <i className="bi bi-exclamation-triangle" />
            </span>
            This old keystore file format is compromised by design - it carries
            its own decryption key inside the file. An upgraded file has been
            downloaded. Delete the old file and keep the new one instead.
          </p>
          {upgradeError && <p className="text-error caption">{upgradeError}</p>}
          <button
            type="button"
            className="button-secondary py-2 px-4 rounded-2"
            onClick={handleManualUpgradeDownload}
          >
            Download upgraded keystore file
          </button>
          <div className="d-flex w-100 mt-2">
            <button
              type="button"
              className="am-link ms-auto px-3"
              onClick={() => {
                setLegacyMnemonic(null);
                setStep("success");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="d-flex flex-column align-items-center justify-content-center text-center gap-3">
          <span
            className="text-success"
            style={{ fontSize: "calc(10px + 10vmin)" }}
          >
            <i className="bi bi-check-circle" />
          </span>
          <h1 className="body2 text-primary">Keystore connected</h1>
          <div className="nav-bg d-flex align-items-center justify-content-between flex-wrap w-100 p-3 rounded-2 caption">
            <span className="text-gray">Address:</span>
            {shortenAddress(address)}
          </div>

          <div className="d-flex flex-column w-100 gap-2 mt-2">
            <button
              type="button"
              className="button-secondary py-2 px-4 rounded-2"
              onClick={handleDownloadKeystore}
            >
              Download keystore
            </button>
            {passkeyAvailable && (
              <button
                type="button"
                className="button-secondary py-2 px-4 rounded-2"
                disabled={passkeyBusy}
                onClick={handleEnablePasskey}
              >
                {passkeyBusy ? "Enabling..." : "Enable passkey unlock"}
              </button>
            )}
            {actionError && <p className="text-error caption">{actionError}</p>}
            {actionMessage && (
              <p className="text-success caption">{actionMessage}</p>
            )}
          </div>

          <div className="d-flex w-100 mt-2">
            <button
              type="button"
              className="am-link ms-auto px-3"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
