const { webcrypto } = require("crypto");
const {
  TextEncoder: NodeTextEncoder,
  TextDecoder: NodeTextDecoder,
} = require("util");
// jsdom defines its own `global.crypto` (getRandomValues/randomUUID only, no
// SubtleCrypto), so `!global.crypto` never trips. Guard on `.subtle` instead
// and replace the whole object via defineProperty since jsdom's `crypto` is
// a getter-only accessor that a plain assignment can't overwrite.
if (!global.crypto || !global.crypto.subtle) {
  Object.defineProperty(global, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}
// jsdom ships no TextEncoder/TextDecoder. Node's util versions return
// Uint8Arrays from Node's realm, which fail libsodium-wrappers' strict
// `instanceof Uint8Array` check inside cosmjs's Argon2id/XChaCha20 modern-format
// path. Re-cast encode() output through the jsdom-realm Uint8Array every suite
// sees, so any test touching cosmjs crypto works without a per-file shim.
const nodeEncoder = new NodeTextEncoder();
global.TextEncoder = class {
  encode(input) {
    return Uint8Array.from(nodeEncoder.encode(input));
  }
};
global.TextDecoder = NodeTextDecoder;
