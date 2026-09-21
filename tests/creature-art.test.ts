import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  creatureArt,
  getCreatureArt,
  hasCreatureArt,
} from "../lib/creature-art.ts";
import { canChooseSpecies, speciesDefinitions } from "../lib/species.ts";

test("registered creature viewports fit real shipped assets", () => {
  for (const [id, art] of Object.entries(creatureArt)) {
    assert.ok(art);
    const { file, width, height } = art.image;
    assert.ok(
      file &&
        !file.startsWith("/") &&
        !file.includes("\\") &&
        !file.split("/").includes(".."),
    );
    const bytes = readFileSync(
      new URL(`../public/assets/${file}`, import.meta.url),
    );
    assert.ok(bytes.length > 0, `Species ${id} has an empty asset`);
    assert.ok(
      Number.isFinite(width) &&
        Number.isFinite(height) &&
        width > 0 &&
        height > 0,
    );
    if (file.endsWith(".png")) {
      assert.equal(bytes.subarray(1, 4).toString(), "PNG");
      assert.equal(width, bytes.readUInt32BE(16), `${file} atlas width`);
      assert.equal(height, bytes.readUInt32BE(20), `${file} atlas height`);
    }
    const [x, y, w, h] = art.viewBox;
    assert.ok(art.viewBox.every(Number.isFinite));
    assert.ok(
      x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= width && y + h <= height,
      `Species ${id} viewport leaves its atlas`,
    );
    if (art.clip?.kind === "polygon") {
      const points = art.clip.points
        .split(/\s+/)
        .map((p) => p.split(",").map(Number));
      assert.ok(points.length >= 3);
      for (const [px, py] of points) {
        assert.ok(Number.isFinite(px) && Number.isFinite(py));
        assert.ok(
          px >= x && px <= x + w && py >= y && py <= y + h,
          `Species ${id} clip leaves its viewport`,
        );
      }
    }
  }
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
