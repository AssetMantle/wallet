// Opt-in localStorage persistence for the passkey-unlock handles ONLY.
// This must never be able to carry a raw key, mnemonic, or legacy blob -
// the allowlist behavior is exercised explicitly below.
const {
  savePasskeyKeystore,
  loadPasskeyKeystore,
  clearPasskeyKeystore,
} = require("../persist");

const RECORD = {
  credentialId: "Y3JlZC1pZC0xMjM", // base64url, arbitrary
  prfSalt: "a1b2c3d4",
  modernBlob: '{"type":"secp256k1hdwallet","kdf":"argon2id","data":"..."}',
};

afterEach(() => {
  clearPasskeyKeystore();
});

test("round-trips save/load exactly", () => {
  savePasskeyKeystore(RECORD);
  expect(loadPasskeyKeystore()).toEqual(RECORD);
});

test("load returns null when nothing has been saved", () => {
  expect(loadPasskeyKeystore()).toBeNull();
});

test("clear removes the record; loaded value after clear is null", () => {
  savePasskeyKeystore(RECORD);
  expect(loadPasskeyKeystore()).not.toBeNull();
  clearPasskeyKeystore();
  expect(loadPasskeyKeystore()).toBeNull();
});

test("refuses/omits any field that isn't one of the three (e.g. a mnemonic must never be persisted)", () => {
  savePasskeyKeystore({
    ...RECORD,
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
    privateKey: "deadbeef",
  });

  const loaded = loadPasskeyKeystore();
  expect(loaded).toEqual(RECORD);
  expect(Object.keys(loaded).sort()).toEqual(
    ["credentialId", "modernBlob", "prfSalt"].sort()
  );

  // Defense in depth: the leaked secret must not even be present in the
  // raw persisted string, not just absent from the parsed/returned object.
  const raw = window.localStorage.getItem(
    Object.keys(window.localStorage).find((k) => k.includes("keystore")) ||
      "__missing__"
  );
  expect(raw || "").not.toContain("abandon");
  expect(raw || "").not.toContain("deadbeef");
});

test("a corrupted/partial stored record loads as null instead of throwing", () => {
  window.localStorage.setItem(
    "am-keystore-passkey-v1",
    JSON.stringify({ credentialId: "only-one-field" })
  );
  expect(loadPasskeyKeystore()).toBeNull();
});

test("non-JSON garbage in storage loads as null instead of throwing", () => {
  window.localStorage.setItem("am-keystore-passkey-v1", "not json{{{");
  expect(loadPasskeyKeystore()).toBeNull();
});
