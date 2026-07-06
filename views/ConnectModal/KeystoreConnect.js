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
// passkey, both via an exportPassword sub-step). Every async primitive here
// is a prior, unit-tested module (legacyV1/modern/account/keystoreStore/
// passkey/persist/download); this component only sequences them and is
// build-verified - the interactive walk-through is the manual browser pass
// in Task 6.
//
// Security-review hardening: the legacy mnemonic and the password that
// unlocked it live only in refs, never React state, and are cleared the
// moment the flow leaves the legacy-upgrade step (M1 - keeps them out of the
// React fiber). Every user-facing export ("Download keystore", the forced
// backup before enabling a passkey) is encrypted with a password freshly
// typed in the exportPassword step, never the secret that unlocked this
// session (M2) - after a passkey unlock that secret is a device-bound PRF
// output nobody can type back in to decrypt a download elsewhere.
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

  // Legacy mnemonic + the password that unlocked it: refs, not state, so
  // they never enter the React fiber (M1). Only ever populated on the legacy
  // path, only ever read for the forced upgrade download, and cleared the
  // moment that step is left (see the "Continue" handler below).
  const legacyMnemonicRef = useRef(null);
  const legacyPasswordRef = useRef(null);
  const [upgradeError, setUpgradeError] = useState(null);
  const upgradeBlobRef = useRef(null);
  const upgradeTriggered = useRef(false);

  const [address, setAddress] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // "Download keystore" / "Enable passkey unlock" both route through this
  // sub-step so the export is always encrypted with a password the user just
  // typed (M2), never the secret that unlocked the session. pendingExportActionRef
  // records which of the two actions is in flight; it never needs to trigger
  // a re-render so it's a ref rather than state.
  const [exportPassword, setExportPassword] = useState("");
  const pendingExportActionRef = useRef(null); // "download" | "enablePasskey"

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
  // legacyMnemonicRef/legacyPasswordRef are refs (M1), so they're read
  // directly rather than listed as effect deps - mutating a ref never needs
  // to re-run this effect, only `step` changing does.
  useEffect(() => {
    if (step !== "legacyUpgrade" || upgradeTriggered.current) return;
    upgradeTriggered.current = true;
    (async () => {
      try {
        const blob = await exportModern(
          legacyMnemonicRef.current,
          legacyPasswordRef.current
        );
        upgradeBlobRef.current = blob;
        downloadModernKeystore(blob, BACKUP_FILENAME);
      } catch {
        setUpgradeError(
          "Could not prepare the upgraded keystore file automatically. Use the button below to try again."
        );
      }
    })();
  }, [step]);

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
  //
  // walletRepo.getWallet(name) is cosmos-kit's own lookup (WalletRepo.getWallet
  // in @cosmos-kit/core, `this.wallets.find(w => w.walletName === name)`) -
  // used here instead of a hand-rolled .find() for the same result. Its
  // sibling walletRepo.connect(name) was deliberately NOT used: it also
  // calls openView() and forwards the chain's configured sessionOptions,
  // which would diverge from how every other wallet button in this same
  // file connects (a bare wallet.connect() with no args).
  async function connectKeystoreWallet(signer, addr) {
    setKeystoreSigner(signer, addr);
    const wallet = walletRepo?.getWallet(KEYSTORE_WALLET_NAME);
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
        // AES-CBC has no integrity check, so a file with a matching password
        // hash but corrupted ciphertext decrypts to a garbage mnemonic that
        // fails bip39 validation here. Surface it instead of throwing silently.
        let signer, addr;
        try {
          ({ signer, address: addr } = await mnemonicToSigner(result.mnemonic));
        } catch {
          setPasswordError("Could not read this keystore file.");
          return;
        }
        const err = await connectKeystoreWallet(signer, addr);
        if (err) {
          setPasswordError(err);
          return;
        }
        legacyMnemonicRef.current = result.mnemonic;
        legacyPasswordRef.current = password;
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
      // prfSecretHex is device-bound and deliberately not retained anywhere
      // (M2): a passkey-unlocked session's user-facing exports always prompt
      // for a fresh password instead (see the exportPassword step).
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
        blob = await exportModern(
          legacyMnemonicRef.current,
          legacyPasswordRef.current
        );
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

  // Both actions below need a keystore export, and every user-facing export
  // must be encrypted with a password the user freshly types (M2) - never
  // the secret that unlocked this session, which after a passkey unlock is a
  // device-bound PRF secret the user could never type back in on another
  // device. These two handlers just record which action was requested and
  // open that prompt; the real export happens in
  // handleExportPasswordConfirm once the password is in.
  function handleDownloadKeystore() {
    if (busy) return;
    setActionError(null);
    setActionMessage(null);
    const { signer } = getKeystoreSigner();
    if (!signer) {
      setActionError("Keystore is locked. Reconnect and try again.");
      return;
    }
    pendingExportActionRef.current = "download";
    setExportPassword("");
    setStep("exportPassword");
  }

  // TODO(manual-verify Task 6): this calls the real, already-unit-tested
  // passkey.js/persist.js primitives end-to-end (enroll -> re-serialize ->
  // persist) rather than a fake handler, but the interactive Touch-ID/PRF
  // round trip itself can only be exercised in a real browser.
  function handleEnablePasskey() {
    if (busy) return;
    setActionError(null);
    setActionMessage(null);
    const { signer } = getKeystoreSigner();
    if (!signer) {
      setActionError("Keystore is locked. Reconnect and try again.");
      return;
    }
    pendingExportActionRef.current = "enablePasskey";
    setExportPassword("");
    setStep("exportPassword");
  }

  function handleCancelExportPassword() {
    setExportPassword("");
    pendingExportActionRef.current = null;
    setStep("success");
  }

  // Confirm handler for the exportPassword step: performs whichever action
  // was requested (plain download, or the forced backup + enroll for
  // passkey unlock), always encrypting with the password just typed here.
  async function handleExportPasswordConfirm() {
    if (busy || !exportPassword || exportPassword.length <= 8) return;
    const action = pendingExportActionRef.current;
    const { signer } = getKeystoreSigner();
    if (!signer) {
      setStep("success");
      setActionError("Keystore is locked. Reconnect and try again.");
      return;
    }
    setBusy(true);
    try {
      if (action === "download") {
        const blob = await signer.serialize(exportPassword);
        downloadModernKeystore(blob, BACKUP_FILENAME);
        setActionMessage("Keystore file downloaded.");
        setActionError(null);
      } else if (action === "enablePasskey") {
        // Force a backup download first: never let the account become
        // solely reliant on this browser's localStorage + passkey.
        const backupBlob = await signer.serialize(exportPassword);
        downloadModernKeystore(backupBlob, BACKUP_FILENAME);

        const { credentialId, prfSalt, prfSecretHex } = await enrollPasskey({
          rpId: window.location.hostname,
          rpName: "AssetMantle Wallet",
          userId: address,
          userName: address,
        });
        // Unlike the user-facing backup above, this blob is never shown to
        // or typed by the user - it's persisted so unlockPasskey() can
        // re-derive this same prfSecretHex from the same authenticator next
        // time, so reusing it here (instead of exportPassword) is correct
        // and not the M2 issue.
        const modernBlob = await signer.serialize(prfSecretHex);
        savePasskeyKeystore({ credentialId, prfSalt, modernBlob });
        setActionMessage(
          "Passkey unlock enabled for this browser. A backup keystore file was downloaded too - keep it somewhere safe."
        );
        setActionError(null);
      }
      setStep("success");
    } catch (error) {
      setActionMessage(null);
      setActionError(
        action === "enablePasskey" && error instanceof PrfUnsupportedError
          ? "This device/browser does not support passkey unlock (PRF). Use your password instead."
          : action === "download"
          ? "Could not prepare the keystore file for download."
          : "Could not enable passkey unlock."
      );
      setStep("success");
    } finally {
      setBusy(false);
      setExportPassword("");
      pendingExportActionRef.current = null;
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
      : step === "exportPassword"
      ? "Set Export Password"
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
                legacyMnemonicRef.current = null;
                legacyPasswordRef.current = null;
                setStep("success");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "exportPassword" && (
        <>
          <p className="text-white-200 caption my-1">
            Choose a password to encrypt this keystore export. You&apos;ll need
            to type this same password to unlock the downloaded file later - it
            isn&apos;t saved anywhere.
          </p>
          <input
            type="password"
            className="am-input w-100 my-3 py-2 px-3 rounded-1 bg-t border-color-white"
            placeholder="******"
            value={exportPassword}
            onChange={(e) => setExportPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && handleExportPasswordConfirm()
            }
          />
          <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mt-3">
            <button
              type="button"
              className="am-link px-3"
              disabled={busy}
              onClick={handleCancelExportPassword}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-primary caption py-2 px-5"
              onClick={handleExportPasswordConfirm}
              disabled={busy || !exportPassword || exportPassword.length <= 8}
            >
              {busy ? "Preparing..." : "Confirm"}
            </button>
          </div>
        </>
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
                onClick={handleEnablePasskey}
              >
                Enable passkey unlock
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
