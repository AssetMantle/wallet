import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";

// coin type 118, verified vs V1 - must stay identical to account.js (HD path
// change breaks migration between the two).
const HD = [stringToPath("m/44'/118'/0'/0/0")];

export async function exportModern(mnemonic, password) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "mantle",
    hdPaths: HD,
  });
  return wallet.serialize(password); // Argon2id + XChaCha20-Poly1305 JSON string
}

export async function importModern(serialization, password) {
  return DirectSecp256k1HdWallet.deserialize(serialization, password);
}
