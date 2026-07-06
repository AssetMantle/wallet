import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";

// coin type 118, verified vs V1 - must stay identical to modern.js (HD path
// change breaks migration between the two).
const HD = [stringToPath("m/44'/118'/0'/0/0")];

export async function mnemonicToSigner(mnemonic) {
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "mantle",
    hdPaths: HD,
  });
  const [account] = await signer.getAccounts();
  return { signer, address: account.address };
}
