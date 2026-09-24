import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import manifest from "../app/manifest.ts";

const root = new URL("../", import.meta.url);

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string) {
  const bytes = readFileSync(new URL(file, root));
  assert.equal(bytes.subarray(1, 4).toString(), "PNG", `${file} is not a PNG`);
  assert.equal(bytes.subarray(12, 16).toString(), "IHDR");
  return `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`;
}

test("every icon the manifest lists exists at the size it claims", () => {
  const { icons = [], start_url, scope } = manifest();
  assert.ok(icons.some((icon) => icon.purpose === "maskable"));
  for (const icon of icons) {
    // Relative, so the base path (/sinifdenizi/ on GitHub Pages) still applies.
    assert.ok(!icon.src.startsWith("/"), `${icon.src} ignores the base path`);
    assert.equal(pngSize(`public/${icon.src}`), icon.sizes);
  }
  assert.deepEqual([start_url, scope], ["./", "./"]);
});

test("browser tab and home screen icons have their expected sizes", () => {
  assert.equal(pngSize("app/icon.png"), "64x64");
  assert.equal(pngSize("app/apple-icon.png"), "180x180");
});
