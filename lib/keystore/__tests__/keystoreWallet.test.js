const { mnemonicToSigner } = require("../account");
const {
  setKeystoreSigner,
  getKeystoreSigner,
  clearKeystoreSigner,
} = require("../keystoreStore");
const {
  KeystoreWallet,
  KeystoreClient,
  keystoreWalletInfo,
} = require("../keystoreWallet");

const MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

// Minimal chain record. setChains() only dereferences `.name` and (via the
// chain wallet) `.chain.chain_id`; everything else it reads with optional
// chaining, so no network / real registry entry is needed.
const assetmantleRecord = {
  name: "assetmantle",
  chain: { chain_id: "mantle-1", chain_name: "assetmantle" },
  assetList: { chain_name: "assetmantle", assets: [] },
};

afterEach(() => {
  clearKeystoreSigner();
});

test("connected KeystoreWallet yields an offline signer whose first account equals the derived address", async () => {
  const { signer, address } = await mnemonicToSigner(MNEMONIC);
  setKeystoreSigner(signer, address);

  // store round-trips exactly what was set (no key persistence beyond memory)
  expect(getKeystoreSigner().address).toBe(address);

  // Build the wallet exactly as ChainProvider does: a MainWalletBase instance,
  // setChains(), then connect the per-chain ChainWalletBase.
  const wallet = new KeystoreWallet(keystoreWalletInfo);
  wallet.setChains([assetmantleRecord]);
  const chainWallet = wallet.getChainWallet("assetmantle");

  await chainWallet.connect();

  // connect() -> update() -> client.getAccount() -> setData(address)
  expect(chainWallet.state).toBe("Done");
  expect(chainWallet.address).toBe(address);

  // getSigningStargateClient() reaches SigningStargateClient.connectWithSigner
  // with exactly this offline signer (initOfflineSigner -> client.getOfflineSigner).
  await chainWallet.initOfflineSigner();
  const [account] = await chainWallet.offlineSigner.getAccounts();
  expect(account.address).toBe(address);
});

test("a locked keystore (no/cleared signer) makes the client refuse to sign", async () => {
  clearKeystoreSigner();
  const client = new KeystoreClient();
  expect(() => client.getOfflineSignerDirect()).toThrow(/locked/i);
  await expect(client.getAccount()).rejects.toThrow(/locked/i);
});

// FIX 1: the client must refuse any chainId that isn't assetmantle's, so a
// mantle1... signer can never be handed to a different chain registered on
// the same <ChainProvider> (e.g. gravitybridge, osmosis).
test("the client refuses to sign for a chainId that is not assetmantle's", async () => {
  const { signer, address } = await mnemonicToSigner(MNEMONIC);
  setKeystoreSigner(signer, address);

  // Build exactly as ChainProvider does, so the client is constructed via the
  // real initClient() -> resolveAssetmantleChainId() path, scoped to whatever
  // chainId the "assetmantle" chain record actually carries (mantle-1) rather
  // than a chainId hardcoded in the test.
  const wallet = new KeystoreWallet(keystoreWalletInfo);
  wallet.setChains([assetmantleRecord]);
  const chainWallet = wallet.getChainWallet("assetmantle");
  await chainWallet.connect();
  expect(chainWallet.state).toBe("Done"); // sanity: the real chain still works

  const client = chainWallet.client;
  const WRONG_CHAIN_ID = "gravity-bridge-3";

  expect(() => client.getOfflineSignerDirect(WRONG_CHAIN_ID)).toThrow(
    /AssetMantle/i
  );
  expect(() => client.getOfflineSigner(WRONG_CHAIN_ID)).toThrow(/AssetMantle/i);
  await expect(client.getAccount(WRONG_CHAIN_ID)).rejects.toThrow(
    /AssetMantle/i
  );

  // the thrown message must never leak the address or mnemonic
  try {
    client.getOfflineSignerDirect(WRONG_CHAIN_ID);
  } catch (error) {
    expect(error.message).not.toContain(address);
    expect(error.message).not.toContain("abandon");
  }
});

// Edge case surfaced while implementing the guard: cosmos-kit copies
// initClient() onto every ChainWalletBase (MainWalletBase.setChains), so
// `this` inside initClient() can be the MainWalletBase itself (holding every
// configured chain) rather than a single ChainWalletBase. The resolver must
// still land on assetmantle's real chainId in that case.
test("resolves assetmantle's chainId even when initClient runs at the main-wallet layer", async () => {
  const wallet = new KeystoreWallet(keystoreWalletInfo);
  wallet.setChains([assetmantleRecord]);

  await wallet.initClient();

  expect(wallet.client.allowedChainId).toBe("mantle-1");
});

// FIX 2: cosmos-kit's own disconnect lifecycle (WalletBase.disconnect() ->
// client?.disconnect?.()) must drop the in-memory keystore key.
test("disconnect() drops the in-memory keystore signer", async () => {
  const { signer, address } = await mnemonicToSigner(MNEMONIC);
  setKeystoreSigner(signer, address);

  const wallet = new KeystoreWallet(keystoreWalletInfo);
  wallet.setChains([assetmantleRecord]);
  const chainWallet = wallet.getChainWallet("assetmantle");
  await chainWallet.connect();
  expect(chainWallet.state).toBe("Done");
  expect(getKeystoreSigner().signer).not.toBeNull();

  // the real cosmos-kit lifecycle, not a direct call to the store helper
  await chainWallet.disconnect();

  expect(getKeystoreSigner().signer).toBeNull();
  expect(getKeystoreSigner().address).toBeNull();
});
