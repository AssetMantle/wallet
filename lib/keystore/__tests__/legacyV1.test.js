const crypto = require("crypto");
const { decryptLegacyV1 } = require("../legacyV1");

// reproduce V1 createKeyStore EXACTLY (walletOld src/utils/helper.js)
function v1CreateKeyStore(mnemonic, password) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(mnemonic, "utf8"),
    cipher.final(),
  ]);
  return {
    hashpwd: crypto.createHash("sha512").update(password).digest("hex"),
    iv: iv.toString("hex"),
    salt: key.toString("hex"),
    crypted: encrypted.toString("hex"),
  };
}
const MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

test("decrypts a real V1 file with the correct password", async () => {
  const file = v1CreateKeyStore(MNEMONIC, "correcthorse");
  expect(await decryptLegacyV1(file, "correcthorse")).toEqual({
    mnemonic: MNEMONIC,
  });
});
test("rejects a wrong password without decrypting", async () => {
  const file = v1CreateKeyStore(MNEMONIC, "correcthorse");
  expect(await decryptLegacyV1(file, "wrong")).toEqual({
    error: "Incorrect password.",
  });
});
test("rejects a non-V1 file shape", async () => {
  expect(await decryptLegacyV1({ foo: "bar" }, "x")).toEqual({
    error: "Not a valid V1 keystore file.",
  });
});
