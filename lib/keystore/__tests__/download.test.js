// Unit-testable slice of downloadModernKeystore: that it builds a Blob
// carrying the exact JSON string handed in, and drives a click through a
// throwaway anchor. Real browser download behavior (save-file-picker /
// disk write) is outside what jsdom can exercise - that's covered by the
// manual browser pass (Task 6).
const { downloadModernKeystore } = require("../download");

// jsdom's Blob has no .text()/.arrayBuffer(); FileReader is the one
// jsdom-supported way to read a Blob's content back out for assertion.
function readBlobAsText(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

afterEach(() => {
  jest.restoreAllMocks();
  delete global.URL.createObjectURL;
  delete global.URL.revokeObjectURL;
});

test("creates a Blob carrying the exact string and revokes the object URL", async () => {
  const createdBlobs = [];
  global.URL.createObjectURL = jest.fn((blob) => {
    createdBlobs.push(blob);
    return "blob:mock-url";
  });
  global.URL.revokeObjectURL = jest.fn();
  const anchor = { click: jest.fn() };
  jest.spyOn(document, "createElement").mockReturnValue(anchor);

  const json = JSON.stringify({ type: "secp256k1hdwallet", kdf: "argon2id" });
  downloadModernKeystore(json, "assetmantle-keystore-modern.json");

  expect(createdBlobs).toHaveLength(1);
  expect(createdBlobs[0]).toBeInstanceOf(Blob);
  expect(createdBlobs[0].type).toBe("application/json");
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

  await expect(readBlobAsText(createdBlobs[0])).resolves.toBe(json);
});

test("sets the anchor's href/download and triggers exactly one click", () => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
  global.URL.revokeObjectURL = jest.fn();
  const anchor = { click: jest.fn() };
  jest.spyOn(document, "createElement").mockReturnValue(anchor);

  downloadModernKeystore("{}", "my-file.json");

  expect(document.createElement).toHaveBeenCalledWith("a");
  expect(anchor.href).toBe("blob:mock-url");
  expect(anchor.download).toBe("my-file.json");
  expect(anchor.click).toHaveBeenCalledTimes(1);
});
