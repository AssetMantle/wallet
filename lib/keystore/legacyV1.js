import { hexToBytes, bytesToHex } from "./hex";

// READ-ONLY reproduction of walletOld's createKeyStore format. We decrypt V1
// files; we never write this format (its AES key is stored in the file).
export async function decryptLegacyV1(fileJson, password) {
  const { hashpwd, iv, salt, crypted } = fileJson || {};
  if (!hashpwd || !iv || !salt || !crypted)
    return { error: "Not a valid V1 keystore file." };
  const digest = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );
  if (bytesToHex(new Uint8Array(digest)) !== hashpwd)
    return { error: "Incorrect password." };
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      hexToBytes(salt),
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );
    const plain = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: hexToBytes(iv) },
      key,
      hexToBytes(crypted)
    );
    return { mnemonic: new TextDecoder().decode(plain) };
  } catch {
    return { error: "Failed to decrypt keystore." };
  }
}
