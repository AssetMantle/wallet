const { mnemonicToSigner } = require("../account");
const MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
test("derives the canonical mantle address at m/44'/118'/0'/0/0", async () => {
  const { address } = await mnemonicToSigner(MNEMONIC);
  expect(address).toMatch(/^mantle1[0-9a-z]{38}$/);
});
