// The realm-safe TextEncoder needed for cosmjs's libsodium path is installed
// globally in jest.setup.js.
const { exportModern, importModern } = require("../modern");
const MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
test("round-trips through the modern encrypted format", async () => {
  const blob = await exportModern(MNEMONIC, "pw-123456789");
  const wallet = await importModern(blob, "pw-123456789");
  const [acct] = await wallet.getAccounts();
  expect(acct.address).toMatch(/^mantle1/);
});
test("wrong password fails to import", async () => {
  const blob = await exportModern(MNEMONIC, "pw-123456789");
  await expect(importModern(blob, "nope")).rejects.toThrow();
});
