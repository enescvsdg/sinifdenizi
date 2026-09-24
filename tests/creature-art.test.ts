import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  creatureArt,
  getCreatureArt,
  hasCreatureArt,
} from "../lib/creature-art.ts";
import { canChooseSpecies, speciesDefinitions } from "../lib/species.ts";
import { decorNames } from "../lib/model.ts";

const assets = new URL("../public/assets/", import.meta.url);

/** Canvas size from a WebP header (lossy, lossless or extended). */
function webpSize(bytes: Buffer) {
  assert.equal(bytes.subarray(0, 4).toString(), "RIFF");
  assert.equal(bytes.subarray(8, 12).toString(), "WEBP");
  const chunk = bytes.subarray(12, 16).toString();
  if (chunk === "VP8X")
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    };
  if (chunk === "VP8L") {
    const bits = bytes.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  assert.equal(chunk, "VP8 ");
  return {
    width: bytes.readUInt16LE(26) & 0x3fff,
    height: bytes.readUInt16LE(28) & 0x3fff,
  };
}

function check(file: string, maxEdge: number, maxBytes: number) {
  const bytes = readFileSync(new URL(file, assets));
  const { width, height } = webpSize(bytes);
  assert.ok(width > 0 && height > 0, `${file} has no size`);
  assert.ok(
    Math.max(width, height) <= maxEdge,
    `${file} is ${width}×${height}`,
  );
  assert.ok(bytes.length <= maxBytes, `${file} is ${bytes.length} bytes`);
}

test("every registered creature has a small WebP sprite", () => {
  for (const [id, file] of Object.entries(creatureArt)) {
    assert.ok(file, `Species ${id} has no file`);
    assert.ok(!file.startsWith("/") && !file.split("/").includes(".."));
    check(file, 320, 60_000);
  }
});

test("decorations and the background stay light", () => {
  decorNames.forEach((_, i) => check(`decor/${i}.webp`, 418, 90_000));
  check("aquarium.webp", 1672, 300_000);
  // Masters live in assets-src/; nothing heavy is published.
  const published = readdirSync(assets, { recursive: true }).map(String);
  assert.deepEqual(
    published.filter((name) => !name.endsWith(".webp") && name.includes(".")),
    [],
  );
});

test("the catalog and renderer share artwork availability without a fallback creature", () => {
  for (const species of speciesDefinitions) {
    const ready = getCreatureArt(species.id) !== undefined;
    assert.equal(species.available, ready);
    assert.equal(canChooseSpecies(species.id, 100_000), ready);
  }
  for (const invalid of [-1, 0.5, NaN, Infinity, 999]) {
    assert.equal(getCreatureArt(invalid), undefined);
    assert.equal(hasCreatureArt(invalid), false);
    assert.equal(canChooseSpecies(invalid, 100_000), false);
  }
});
