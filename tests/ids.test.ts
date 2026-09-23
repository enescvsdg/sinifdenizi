import { test } from "node:test";
import assert from "node:assert/strict";
import { createId } from "../lib/ids.ts";

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test("IDs are version 4 UUIDs even without randomUUID (plain HTTP)", () => {
  const insecure = {
    getRandomValues: (array: Uint8Array<ArrayBuffer>) =>
      crypto.getRandomValues(array),
  };
  const ids = new Set(Array.from({ length: 500 }, () => createId(insecure)));
  assert.equal(ids.size, 500);
  for (const id of ids) assert.match(id, uuid);
  assert.match(createId(), uuid);
});
