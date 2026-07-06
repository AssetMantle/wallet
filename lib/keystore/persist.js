// Opt-in localStorage persistence for the passkey-unlock keystore handle.
//
// This is the ONLY place a keystore secret is allowed to touch disk, and
// even then never in the clear: the three fields below are a WebAuthn
// credential handle, its PRF salt, and the MODERN (Argon2id +
// XChaCha20-Poly1305 encrypted, see ./modern.js) blob. A raw key, mnemonic,
// or the read-only legacy V1 shape must never reach this module - callers
// only ever hand it what enrollPasskey()/exportModern() already produced.
//
// savePasskeyKeystore() allowlists exactly these three fields on the way in
// (rather than validating-then-rejecting extras), so any extra property a
// caller accidentally attaches - a mnemonic, a raw private key - is silently
// dropped, never serialized to storage.
const STORAGE_KEY = "am-keystore-passkey-v1";

export function savePasskeyKeystore({ credentialId, prfSalt, modernBlob }) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ credentialId, prfSalt, modernBlob })
  );
}

export function loadPasskeyKeystore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const { credentialId, prfSalt, modernBlob } = parsed || {};
  if (!credentialId || !prfSalt || !modernBlob) return null;
  return { credentialId, prfSalt, modernBlob };
}

export function clearPasskeyKeystore() {
  localStorage.removeItem(STORAGE_KEY);
}
