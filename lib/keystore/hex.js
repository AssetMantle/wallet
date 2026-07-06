export function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++)
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}
export function bytesToHex(b) {
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
