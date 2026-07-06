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
