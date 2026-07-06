// In-memory holder for the keystore account's live cosmjs signer.
//
// The private key / mnemonic is NEVER persisted here: no localStorage, no disk,
// no logging. Only the already-derived OfflineDirectSigner object (from
// mnemonicToSigner) and its bech32 address live in module memory, and
// clearKeystoreSigner() drops both on logout / tab close. The signer is a
// module-level singleton so every consumer (the cosmos-kit adapter, the login
// UI) reads the same unlocked account.

let current = { signer: null, address: null };

export function setKeystoreSigner(signer, address) {
  current = { signer, address };
}

export function getKeystoreSigner() {
  return current;
}

export function clearKeystoreSigner() {
  current = { signer: null, address: null };
}
