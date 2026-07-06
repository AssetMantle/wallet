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
import { getKeystoreSigner, clearKeystoreSigner } from "./keystoreStore";

const KEYSTORE_LOCKED_MESSAGE =
  "Keystore is locked. Unlock your keystore account before signing.";

// FIX 1 guard error. Static and generic on purpose: never interpolate a
// chain-id, address, or key material into it.
const WRONG_CHAIN_MESSAGE =
  "Keystore wallet supports only the AssetMantle chain";

// A cosmos-kit chain record (see convertChain in @cosmos-kit/core) is
// AssetMantle's when its registry chain_name is "assetmantle" or, as a
// fallback, its bech32 address prefix is "mantle". Never match on a
// hardcoded chain-id string (e.g. "mantle-1") — that differs between
// mainnet/testnet, while the registry name and bech32 prefix do not.
function isAssetmantleChainRecord(chainRecord) {
  const chain = chainRecord?.chain;
  const chainName = chain?.chain_name ?? chainRecord?.name;
  return chainName === "assetmantle" || chain?.bech32_prefix === "mantle";
}

// Resolves AssetMantle's chain_id from whatever chain-record context is
// reachable off `this` inside initClient(). MainWalletBase.setChains() copies
// initClient onto every ChainWalletBase it creates, so `this` can be EITHER
// the MainWalletBase (holds every configured chain via `chainWallets`) or a
// single ChainWalletBase (holds only its own `chainRecord`), depending on
// which object's connect() first builds the client. Prefers an exact
// chain_name match across every configured chain before falling back to the
// bech32 prefix, so registration order never matters. Returns undefined
// (never a guess) when no assetmantle record is reachable, so the client
// fails closed instead of trusting an unrelated chain.
function resolveAssetmantleChainId(walletLike) {
  if (walletLike?.chainWallets) {
    const chainWallets = Array.from(walletLike.chainWallets.values());
    const byName = chainWallets.find(
      (chainWallet) =>
        (chainWallet.chainRecord?.chain?.chain_name ??
          chainWallet.chainRecord?.name) === "assetmantle"
    );
    if (byName) return byName.chainId;
    const byPrefix = chainWallets.find(
      (chainWallet) =>
        chainWallet.chainRecord?.chain?.bech32_prefix === "mantle"
    );
    return byPrefix?.chainId;
  }
  if (walletLike?.chainRecord) {
    return isAssetmantleChainRecord(walletLike.chainRecord)
      ? walletLike.chainId
      : undefined;
  }
  return undefined;
}

// The wallet client: bridges keystoreStore's in-memory signer into the shape
// the cosmos-kit base classes call. `allowedChainId` is AssetMantle's
// chain_id, resolved from real chain records (see resolveAssetmantleChainId)
// rather than hardcoded, so the client can refuse any other chain the same
// <ChainProvider> also registers (e.g. gravitybridge, osmosis).
export class KeystoreClient {
  constructor(allowedChainId) {
    this.allowedChainId = allowedChainId;
  }

  // FIX 1 guard: throws unless the requested chainId is AssetMantle's.
  assertChain(chainId) {
    if (chainId !== this.allowedChainId) {
      throw new Error(WRONG_CHAIN_MESSAGE);
    }
  }

  async connect() {
    // no-op: the signer is already in memory once the user unlocks the keystore.
  }

  // FIX 2: cosmos-kit's WalletBase.disconnect() calls `client?.disconnect?.()`
  // as part of its own disconnect lifecycle; drop the in-memory key here too.
  disconnect() {
    clearKeystoreSigner();
  }

  async getAccount(chainId) {
    this.assertChain(chainId);
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

  getOfflineSigner(chainId) {
    return this.getOfflineSignerDirect(chainId);
  }

  getOfflineSignerDirect(chainId) {
    this.assertChain(chainId);
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
      this.initClientDone(new KeystoreClient(resolveAssetmantleChainId(this)));
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
