// Triggers a browser download of a modern keystore JSON blob. Deliberately
// tiny: build a Blob, point a throwaway anchor at an object URL for it, and
// click it. No DOM attachment needed - clicking an anchor works whether or
// not it's attached, and skipping the attach/detach keeps this a one-shot
// helper with nothing to clean up but the object URL itself.
export function downloadModernKeystore(blobString, filename) {
  const blob = new Blob([blobString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
