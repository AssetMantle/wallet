test("jest runs", () => {
  expect(1 + 1).toBe(2);
});
test("WebCrypto SubtleCrypto is available", async () => {
  const d = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("x")
  );
  expect(new Uint8Array(d).length).toBe(32);
});
