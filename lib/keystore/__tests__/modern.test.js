// jsdom (26.x here) ships no TextEncoder, so jest.setup.js falls back to
// Node's util.TextEncoder, whose .encode() returns a Uint8Array from Node's
// own realm. libsodium-wrappers (pulled in by DirectSecp256k1HdWallet's
// Argon2id/XChaCha20 modern-format path) does a strict `instanceof
// Uint8Array` check on the plaintext it encrypts, so that cross-realm
// Uint8Array trips "TypeError: unsupported input type for message". Re-cast
// through this file's own (jsdom-realm) Uint8Array before cosmjs sees the
// bytes. Scoped to this file only - every test file gets its own fresh
// jsdom global, so this can't leak into account.js/legacyV1's tests.
const { TextEncoder: NodeTextEncoder } = require("util");
global.TextEncoder = class {
  encode(str) {
    return Uint8Array.from(new NodeTextEncoder().encode(str));
  }
};

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
