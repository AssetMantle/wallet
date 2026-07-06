// SPIKE - WebAuthn PRF request/response shapes (Task 4: passkey-as-unlock).
//
// Passkeys are P-256 and cannot sign Cosmos (secp256k1) transactions, so this
// module never uses a passkey as a signing key. It uses the WebAuthn PRF
// extension purely to derive a stable 32-byte secret per authenticator tap,
// and that secret (hex-encoded) is fed to the existing modern keystore
// (./modern.js exportModern/importModern) as an ordinary password. No new
// crypto primitive is introduced here.
//
// Confirmed against the WebAuthn Level 3 spec's `prf` extension and the
// shape this module's own tests mock:
//
//   1. Enrollment calls `navigator.credentials.create({ publicKey: { ...,
//      extensions: { prf: {} } } })`. The created credential's own
//      `getClientExtensionResults().prf` (when present) only reports
//      capability (`{ enabled: true }`) at this stage - `create()` never
//      returns PRF *output* bytes, only whether the authenticator supports
//      the extension.
//   2. A PRF secret is pulled by immediately following up with
//      `navigator.credentials.get({ publicKey: { ...,
//      allowCredentials: [{ id: <credential.rawId>, type: "public-key" }],
//      extensions: { prf: { eval: { first: <32-byte salt> } } } } })`.
//   3. The secret lands at
//      `assertion.getClientExtensionResults().prf.results.first` as an
//      ArrayBuffer (32 bytes for a SHA-256-based authenticator PRF). If
//      `.prf` or `.prf.results.first` is missing, the authenticator/browser
//      does not support PRF and this module throws `PrfUnsupportedError`
//      rather than silently falling back to a weaker unlock path.
//   4. Unlocking later (`unlockPasskey`) re-runs step 2 only, keyed by the
//      *same* salt used at enrollment - the PRF output is deterministic per
//      (credential, salt) pair, which is what lets it stand in for a stable
//      keystore password across sessions.
//
// Encoding notes:
//   - `credentialId` is returned/consumed as base64url (of `rawId`'s raw
//     bytes). This repo's `hexToBytes`/`bytesToHex` (./hex.js) are reused for
//     the PRF salt/secret, but WebAuthn credential IDs are conventionally
//     base64url (what `PublicKeyCredential.id` gives back in a browser), so
//     small local base64url helpers are used instead of overloading hex for
//     both. They're implemented with `atob`/`btoa` (standard Web APIs,
//     present in every browser and in jsdom) rather than Node's `Buffer`,
//     since this module ships to the browser and this repo's webpack config
//     has no `Buffer` polyfill for client bundles (see ../legacyV1.js, which
//     avoids `Buffer` in browser-facing keystore code for the same reason).
//   - `user.id` in the `create()` call must be a BufferSource per spec; this
//     module accepts `userId` as a string (a stable local user/account
//     identifier) and encodes it with `TextEncoder` - pass raw bytes
//     directly if the caller already has them.
//   - `challenge` is generated locally via `crypto.getRandomValues` rather
//     than sourced from/verified by a server: this passkey is used purely as
//     a local UNLOCK secret (PRF output -> keystore password), not as a
//     server-verified login assertion, so there is no relying-party backend
//     to source or check the challenge/attestation against. Wiring this into
//     a real server-verified WebAuthn login later must source the challenge
//     from that server instead.
//   - `pubKeyCredParams` requests alg -7 (ES256 / P-256), the one every
//     platform authenticator supports; it is never used to sign anything
//     here (see above), only to satisfy `create()`'s required shape.
//
// E2E note (manual/CI-optional, not part of this unit suite): a documented
// CDP virtual-authenticator flow - `CDPSession.send("WebAuthn.enable")` then
// `addVirtualAuthenticator({ protocol: "ctap2", transport: "internal",
// hasResidentKey: true, hasUserVerification: true, hasPrf: true,
// isUserVerified: true })` via Playwright - driving enroll -> persist ->
// reload -> unlock against a *real* (virtual) authenticator implementation,
// is the next validation layer above this mocked unit suite. Real Touch ID /
// platform-authenticator behavior is a separate manual check; neither this
// module nor its tests can substitute for either.

import { bytesToHex, hexToBytes } from "./hex";

export class PrfUnsupportedError extends Error {
  constructor(
    message = "This authenticator/browser did not return a PRF secret."
  ) {
    super(message);
    this.name = "PrfUnsupportedError";
  }
}

function randomBytes(length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

function toBufferSource(value) {
  return typeof value === "string" ? new TextEncoder().encode(value) : value;
}

// base64url (RFC 4648 section 5) via atob/btoa - see "Encoding notes" above
// for why this avoids Node's Buffer.
function bytesToBase64url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++)
    binary += String.fromCharCode(bytes[i]);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Shared by enrollPasskey/unlockPasskey: both read the PRF secret out of a
// create()/get() result the same way and must fail the same way when the
// authenticator didn't honor the extension.
function extractPrfSecretHex(credentialOrAssertion) {
  const results = credentialOrAssertion.getClientExtensionResults();
  const first =
    results && results.prf && results.prf.results && results.prf.results.first;
  // A missing OR empty PRF result must fail like an unsupported authenticator:
  // an empty secret would silently become an empty keystore password.
  if (!first || first.byteLength === 0) throw new PrfUnsupportedError();
  return bytesToHex(new Uint8Array(first));
}

export async function isPrfSupported() {
  if (typeof navigator === "undefined" || !navigator.credentials) return false;
  // Read via globalThis (always a recognized identifier) rather than the
  // bare `PublicKeyCredential` global - this WebAuthn-specific global isn't
  // in this project's configured eslint browser globals (unlike `crypto`/
  // `navigator`/`TextEncoder`, which already are), and a property read never
  // throws the way a bare undeclared-identifier reference would elsewhere.
  const PublicKeyCredentialGlobal = globalThis.PublicKeyCredential;
  if (typeof PublicKeyCredentialGlobal === "undefined") return false;
  if (typeof PublicKeyCredentialGlobal.getClientCapabilities === "function") {
    try {
      const capabilities =
        await PublicKeyCredentialGlobal.getClientCapabilities();
      return !!capabilities["extension:prf"];
    } catch {
      return false;
    }
  }
  // No capability-query API (older browsers): the base WebAuthn surface is
  // present, but actual PRF support can only be confirmed by the create()/
  // get() round-trip in enrollPasskey, which throws PrfUnsupportedError when
  // the authenticator doesn't honor the extension.
  return true;
}

export async function enrollPasskey({ rpId, rpName, userId, userName }) {
  const prfSaltBytes = randomBytes(32);

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: randomBytes(32),
      rp: { id: rpId, name: rpName },
      user: {
        id: toBufferSource(userId),
        name: userName,
        displayName: userName,
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      extensions: { prf: {} },
    },
  });

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomBytes(32),
      allowCredentials: [{ id: credential.rawId, type: "public-key" }],
      extensions: { prf: { eval: { first: prfSaltBytes } } },
    },
  });

  return {
    credentialId: bytesToBase64url(new Uint8Array(credential.rawId)),
    prfSalt: bytesToHex(prfSaltBytes),
    prfSecretHex: extractPrfSecretHex(assertion),
  };
}

export async function unlockPasskey({ credentialId, prfSalt }) {
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomBytes(32),
      allowCredentials: [
        { id: base64urlToBytes(credentialId), type: "public-key" },
      ],
      extensions: { prf: { eval: { first: hexToBytes(prfSalt) } } },
    },
  });

  return extractPrfSecretHex(assertion);
}
