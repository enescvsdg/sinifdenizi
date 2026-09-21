import { test } from "node:test";
import assert from "node:assert/strict";
import { assignStudentFish, initialState } from "../lib/model.ts";
import { canChooseSpecies, filterSpecies, speciesDefinitions, catalogOrder } from "../lib/species.ts";

test("catalog preserves legacy species IDs and never assigns missing artwork", () => {
  assert.equal(speciesDefinitions.length, 30);
  assert.equal(new Set(catalogOrder).size, 30);
  const state = initialState();
  const id = state.students[0].id;
  for (let i = 12; i < 30; i++) {
    assert.equal(canChooseSpecies(i, 10000), false);
    assert.equal(assignStudentFish(state, id, i), state);
  }
  const changed = assignStudentFish(state, id, 7);
  assert.equal(changed.students[0].fish, 7);
  assert.equal(state.students[0].fish, 0);
  assert.equal(changed.students[0].xp, state.students[0].xp);
  assert.equal(assignStudentFish(state, id, -1), state);
  assert.equal(assignStudentFish(state, "missing", 1), state);
});

test("Turkish catalog searches match dotted and dotless letters", () => {
  assert.equal(filterSpecies("all", "SARI TANG")[0].id, 2);
  assert.equal(filterSpecies("all", "denizanasi")[0].id, 11);
  assert.ok(filterSpecies("large").every((s) => s.category === "large"));
});
