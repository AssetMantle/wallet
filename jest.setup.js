const { webcrypto } = require("crypto");
const { TextEncoder, TextDecoder } = require("util");
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
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;
