/**
 * KeystoreWallet — a cosmos-kit software (non-extension) wallet adapter that
 * exposes the in-memory DirectSecp256k1HdWallet held by keystoreStore to the
 * app's EXISTING cosmos-kit signing paths, with no browser extension involved
 * and no edit to data/txApi.js.
 *
 * ── SPIKE FINDINGS (read against the installed node_modules, Step 1) ──────────
 * Versions: @cosmos-kit/core 1.0.11, @cosmos-kit/keplr 0.32.28,
 *           @cosmos-kit/react 1.0.14. (Packages ship CommonJS under `main/`,
 *           not `cjs/`; base classes live in core/main/bases/.)
 *
 * A `wallets` array element passed to <ChainProvider wallets={[...]}> is a
 * MainWalletBase INSTANCE. Proof: @cosmos-kit/keplr's export is literally
 *   `wallets = [ new KeplrExtensionWallet(keplrExtensionInfo, preferredEndpoints) ]`
 * (keplr-extension/main/keplr.js). ChainProvider calls setChains() on each
 * wallet, which builds one ChainWalletBase per chain via `new this.ChainWallet`
 * (core/main/bases/main-wallet.js).
 *
 * The MINIMAL surface a software wallet must implement:
 *   1. A MainWalletBase subclass with async initClient() that calls
 *      this.initClientDone(<client>). `client` is just read back via the
 *      WalletBase `client` getter (clientMutable.data) — no window/extension
 *      probe is required (core/main/bases/wallet.js).
 *   2. A ChainWalletBase subclass — can be EMPTY; ChainKeplrExtension is empty.
 *      ChainWalletBase already implements connect()/update(), initOfflineSigner()
 *      and getSigningStargateClient() against `this.client`.
 *   3. The `client` object, whose methods the base classes call:
 *        • getAccount(chainId) -> { name, address, algo, pubkey }
 *            called by ChainWalletBase.update() on connect(); only .address and
 *            .name are consumed for setData (chain-wallet.js update()).
 *        • getOfflineSigner(chainId) -> OfflineDirectSigner
 *            called by ChainWalletBase.initOfflineSigner(), which
 *            getSigningStargateClient() runs before
 *            SigningStargateClient.connectWithSigner(rpc, offlineSigner).
 *        • getOfflineSignerDirect(chainId) -> OfflineDirectSigner
 *            surfaced by useChain().getOfflineSignerDirect (react/main/hooks.js).
 *        • connect(chainId, isMobile) — OPTIONAL (invoked with ?.); no-op here.
 *
 * Delegation proof (react/main/hooks.js `useChain`):
 *   getSigningStargateClient() -> current.getSigningStargateClient()  [ChainWalletBase]
 *   getOfflineSigner(chainId)  -> current.client.getOfflineSigner(chainId)
 * So data/txApi.js's `getSigningStargateClient()` reaches
 * SigningStargateClient.connectWithSigner(rpc, <our in-memory signer>) unchanged.
 *
 * NOT required for a software signer (all optional or extension/wallet-connect
 * only): the event emitter, session, addChain, sendTx, signAmino/signDirect.
 * Amino signing is intentionally unsupported — DirectSecp256k1HdWallet is
 * direct-only and the mantle tx paths sign via getSigningStargateClient (direct).
 * Conclusion: tractable with a ~1-method client and two thin subclasses.
 */

import { MainWalletBase, ChainWalletBase } from "@cosmos-kit/core";
import { getKeystoreSigner } from "./keystoreStore";

const KEYSTORE_LOCKED_MESSAGE =
  "Keystore is locked. Unlock your keystore account before signing.";

// The wallet client: bridges keystoreStore's in-memory signer into the shape
// the cosmos-kit base classes call. chainId args are part of the interface but
// a single-key keystore serves one derived account regardless of chain, so they
// are ignored.
export class KeystoreClient {
  async connect() {
    // no-op: the signer is already in memory once the user unlocks the keystore.
  }

  async getAccount() {
    const { signer } = getKeystoreSigner();
    if (!signer) throw new Error(KEYSTORE_LOCKED_MESSAGE);
    const [account] = await signer.getAccounts();
    return {
      name: "Keystore",
      address: account.address,
      algo: account.algo,
      pubkey: account.pubkey,
    };
  }

  getOfflineSigner() {
    return this.getOfflineSignerDirect();
  }

  getOfflineSignerDirect() {
    const { signer } = getKeystoreSigner();
    if (!signer) throw new Error(KEYSTORE_LOCKED_MESSAGE);
    return signer;
  }

  getOfflineSignerAmino() {
    throw new Error(
      "Amino signing is not supported by the keystore wallet; use direct signing."
    );
  }
}

// Empty subclass: ChainWalletBase already does everything against `this.client`.
export class ChainKeystore extends ChainWalletBase {}

export class KeystoreWallet extends MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainKeystore);
  }

  async initClient() {
    this.initingClient();
    try {
      this.initClientDone(new KeystoreClient());
    } catch (error) {
      this.initClientError(error);
    }
  }
}

// Registry entry (walletInfo). `mode` only needs to be anything other than
// "wallet-connect" (WalletBase.connect branches on that); no real extension is
// probed because initClient always yields our in-memory client.
export const keystoreWalletInfo = {
  name: "keystore-wallet",
  prettyName: "Keystore",
  mode: "extension",
  mobileDisabled: false,
  rejectMessage: { source: "Request rejected" },
  // inline key glyph so the wallet list never renders a broken image (no fetch)
  logo: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y0YjczMSI+PHBhdGggZD0iTTEyLjY1IDEwQTUuOTkgNS45OSAwIDAgMCA3IDZhNiA2IDAgMSAwIDUuNjUgOEgxN3Y0aDR2LTRoMnYtNGgtMTAuMzV6TTcgMTZhMiAyIDAgMSAxIDAtNCAyIDIgMCAwIDEgMCA0eiIvPjwvc3ZnPg==",
  downloads: [],
};

// cosmos-kit consumes a module-level singleton array (mirrors @cosmos-kit/keplr).
export const keystoreWallet = new KeystoreWallet(keystoreWalletInfo);
export const wallets = [keystoreWallet];
