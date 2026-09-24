import { test } from "node:test";
import assert from "node:assert/strict";
import { decorSlots } from "../lib/decor-slots.ts";
import { decorNames } from "../lib/model.ts";

test("every decoration has its own place on phones, boards and wide screens", () => {
  assert.equal(decorSlots.length, decorNames.length);
  // Aquarium width ÷ height: phone, full screen, wide desktop card.
  for (const aspect of [0.9, 1.78, 2.5]) {
    const boxes = decorSlots.map(({ left, width, bottom }) => ({
      x: [left, left + width],
      y: [bottom, bottom + width * aspect],
    }));
    boxes.forEach((a, i) => {
      assert.ok(
        a.x[0] >= 0 && a.x[1] <= 100,
        `${decorNames[i]} leaves the glass`,
      );
      boxes.slice(i + 1).forEach((b, k) => {
        const overlap =
          a.x[0] < b.x[1] &&
          b.x[0] < a.x[1] &&
          a.y[0] < b.y[1] &&
          b.y[0] < a.y[1];
        assert.ok(
          !overlap,
          `${decorNames[i]} overlaps ${decorNames[i + 1 + k]} at ${aspect}`,
        );
      });
    });
  }
});
