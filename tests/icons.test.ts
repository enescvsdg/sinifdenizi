import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import manifest from "../app/manifest.ts";

const root = new URL("../", import.meta.url);

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file: string) {
  const bytes = readFileSync(new URL(file, root));
  assert.equal(bytes.subarray(1, 4).toString(), "PNG", `${file} is not a PNG`);
  assert.equal(bytes.subarray(12, 16).toString(), "IHDR");
  return `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`;
}

/** Width and height from a JPEG's start-of-frame segment. */
function jpegSize(file: string) {
  const bytes = readFileSync(new URL(file, root));
  assert.equal(bytes.readUInt16BE(0), 0xffd8, `${file} is not a JPEG`);
  for (let i = 2; i + 9 < bytes.length; i += 2 + bytes.readUInt16BE(i + 2)) {
    const marker = bytes[i + 1];
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    )
      return `${bytes.readUInt16BE(i + 7)}x${bytes.readUInt16BE(i + 5)}`;
  }
  assert.fail(`${file} has no frame header`);
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

test("the link preview image has the size social networks expect", () => {
  assert.equal(jpegSize("app/opengraph-image.jpg"), "1200x630");
  assert.ok(statSync(new URL("app/opengraph-image.jpg", root)).size < 300_000);
  // Next.js copies the text into the page as is, so no stray newline.
  const alt = readFileSync(
    new URL("app/opengraph-image.alt.txt", root),
    "utf8",
  );
  assert.ok(alt.length > 20 && alt === alt.trim());
});
