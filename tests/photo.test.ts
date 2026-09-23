import { test } from "node:test";
import assert from "node:assert/strict";
import { photoCrop } from "../lib/photo.ts";

test("photos are cropped to a centred square of at most 256 px", () => {
  assert.deepEqual(photoCrop(4000, 3000), {
    sx: 500,
    sy: 0,
    side: 3000,
    size: 256,
  });
  assert.deepEqual(photoCrop(1080, 1920), {
    sx: 0,
    sy: 420,
    side: 1080,
    size: 256,
  });
  // Small photos are not enlarged.
  assert.deepEqual(photoCrop(120, 90), { sx: 15, sy: 0, side: 90, size: 90 });
});
