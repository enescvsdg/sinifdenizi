import { test } from "node:test";
import assert from "node:assert/strict";
import { assignStudentFish, initialState } from "../lib/model.ts";
import {
  canChooseSpecies,
  filterSpecies,
  speciesDefinitions,
  catalogOrder,
} from "../lib/species.ts";

test("catalog preserves IDs and gates assignment by actual art and student XP", () => {
  assert.equal(speciesDefinitions.length, 30);
  assert.equal(new Set(catalogOrder).size, 30);
  const state = initialState();
  const id = state.students[0].id;
  for (const fish of speciesDefinitions) {
    assert.equal(canChooseSpecies(fish.id, 10000), fish.available);
    if (!fish.available || fish.unlockXp > state.students[0].xp) {
      assert.equal(assignStudentFish(state, id, fish.id), state);
    }
  }
  const changed = assignStudentFish(state, id, 7);
  assert.equal(changed.students[0].fish, 7);
  assert.equal(state.students[0].fish, 0);
  assert.equal(changed.students[0].xp, state.students[0].xp);
  assert.equal(assignStudentFish(state, id, -1), state);
  assert.equal(assignStudentFish(state, "missing", 1), state);
});

test("special creatures unlock at their exact student XP thresholds", () => {
  for (const [id, xp] of [
    [27, 500],
    [28, 1500],
    [29, 3000],
  ]) {
    assert.equal(canChooseSpecies(id, xp - 1), false);
    assert.equal(canChooseSpecies(id, xp), speciesDefinitions[id].available);
    const state = initialState();
    state.students[0].xp = xp;
    const changed = assignStudentFish(state, state.students[0].id, id);
    if (speciesDefinitions[id].available)
      assert.equal(changed.students[0].fish, id);
    assert.equal(changed.students[0].xp, xp);
  }
});

test("a fresh classroom uses diverse unlocked creatures", () => {
  const state = initialState();
  const available = speciesDefinitions.filter((fish) =>
    canChooseSpecies(fish.id, 0),
  ).length;
  assert.equal(
    new Set(state.students.map((student) => student.fish)).size,
    Math.min(available, state.students.length),
  );
  assert.ok(
    state.students.every((student) =>
      canChooseSpecies(student.fish, student.xp),
    ),
  );
});

test("Turkish catalog searches match dotted and dotless letters", () => {
  assert.equal(filterSpecies("all", "SARI TANG")[0].id, 2);
  assert.equal(filterSpecies("all", "denizanasi")[0].id, 11);
  assert.ok(filterSpecies("large").every((s) => s.category === "large"));
});
