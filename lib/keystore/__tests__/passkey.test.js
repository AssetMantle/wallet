// Unit-level tests with a MOCKED navigator.credentials (WebAuthn). This
// proves the plumbing (request/response shapes, encoding, error path, and
// that the derived secret really works as a keystore password). It does not
// prove a real platform authenticator (Touch ID) behaves this way - that is
// the separate CDP virtual-authenticator / manual check documented at the
// bottom of ../passkey.js.
const { bytesToHex } = require("../hex");
const { exportModern, importModern } = require("../modern");
const { mnemonicToSigner } = require("../account");
const {
  isPrfSupported,
  enrollPasskey,
  unlockPasskey,
  PrfUnsupportedError,
} = require("../passkey");

const MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const ENROLL_PARAMS = {
  rpId: "wallet.assetmantle.one",
  rpName: "AssetMantle Wallet",
  userId: "user-123",
  userName: "user-123",
};

// Fixed 32-byte "PRF output" the mocked authenticator hands back for any
// (credential, salt) pair. A real authenticator's PRF output is a
// deterministic function of (credential, salt); the mock does not need to
// simulate that math, only stand in for its shape (an ArrayBuffer) so this
// suite can prove the plumbing around it.
const FIXED_PRF_BYTES = new Uint8Array(32);
for (let i = 0; i < 32; i++) FIXED_PRF_BYTES[i] = i;
const FIXED_PRF_HEX = bytesToHex(FIXED_PRF_BYTES);

const FIXED_RAW_ID = new Uint8Array(16);
for (let i = 0; i < 16; i++) FIXED_RAW_ID[i] = 0xa0 + i;

// Builds the mocked return value of both create() and get(): a credential /
// assertion object exposing `rawId` (ArrayBuffer) and
// `getClientExtensionResults()`. Pass `null` for prfFirstBuffer to simulate
// an authenticator that does not support the PRF extension (empty `{}`
// extension results, per the spec when a requested extension isn't honored).
function mockCredential(prfFirstBuffer) {
  return {
    rawId: FIXED_RAW_ID.buffer,
    getClientExtensionResults: () =>
      prfFirstBuffer ? { prf: { results: { first: prfFirstBuffer } } } : {},
  };
}

function installMockedWebAuthn(prfFirstBuffer = FIXED_PRF_BYTES.buffer) {
  global.navigator = global.navigator || {};
  navigator.credentials = {
    create: jest.fn().mockResolvedValue(mockCredential(prfFirstBuffer)),
    get: jest.fn().mockResolvedValue(mockCredential(prfFirstBuffer)),
  };
  global.PublicKeyCredential = function PublicKeyCredential() {};
}

afterEach(() => {
  if (typeof navigator !== "undefined") delete navigator.credentials;
  delete global.PublicKeyCredential;
});

test("enrollPasskey returns a stable prfSecretHex matching the fixed PRF buffer", async () => {
  installMockedWebAuthn();

  const { credentialId, prfSalt, prfSecretHex } = await enrollPasskey(
    ENROLL_PARAMS
  );

  expect(prfSecretHex).toBe(FIXED_PRF_HEX);
  expect(typeof credentialId).toBe("string");
  expect(prfSalt).toMatch(/^[0-9a-f]{64}$/); // 32 random bytes, hex-encoded
});

test("unlockPasskey with the same salt returns the same secret", async () => {
  installMockedWebAuthn();
  const enrolled = await enrollPasskey(ENROLL_PARAMS);

  const unlockedHex = await unlockPasskey({
    credentialId: enrolled.credentialId,
    prfSalt: enrolled.prfSalt,
  });

  expect(unlockedHex).toBe(enrolled.prfSecretHex);
});

// INTEGRATION (key assertion): the passkey-derived secret must work as an
// ordinary keystore password - exportModern/importModern do real Argon2id +
// XChaCha20-Poly1305 work, hence the extended timeout.
test("passkey-derived secret round-trips the real modern keystore (works as its password)", async () => {
  installMockedWebAuthn();
  const { prfSecretHex } = await enrollPasskey(ENROLL_PARAMS);

  const blob = await exportModern(MNEMONIC, prfSecretHex);
  const wallet = await importModern(blob, prfSecretHex);
  const [account] = await wallet.getAccounts();

  const { address } = await mnemonicToSigner(MNEMONIC);
  expect(account.address).toBe(address);
}, 30000);

test("throws PrfUnsupportedError when the authenticator returns no PRF result", async () => {
  installMockedWebAuthn(null);

  await expect(enrollPasskey(ENROLL_PARAMS)).rejects.toThrow(
    PrfUnsupportedError
  );
});

test("isPrfSupported() is false when navigator.credentials is undefined (jsdom default)", async () => {
  delete navigator.credentials; // explicit precondition, independent of afterEach ordering

  await expect(isPrfSupported()).resolves.toBe(false);
});
