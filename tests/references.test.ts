import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../design-reference/", import.meta.url);

test("every design reference is a whole JPEG", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".jpg"));
  assert.ok(files.length >= 8);
  for (const file of files) {
    const bytes = readFileSync(new URL(file, dir));
    // An upload cut short keeps its start marker but loses the end one.
    assert.equal(bytes.subarray(0, 2).toString("hex"), "ffd8", file);
    assert.equal(
      bytes.subarray(-2).toString("hex"),
      "ffd9",
      `${file} is cut off`,
    );
  }
});
