import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  approveTask,
  feedStudents,
  classXp,
  validState,
  decorThresholds,
} from "../lib/model.ts";
import { createSwimmers, stepSwimmers } from "../lib/swimming.ts";
test("approval rewards the assigned student exactly once", () => {
  const s = initialState(),
    id = s.students[23].id,
    t = s.tasks[0],
    next = approveTask(s, t.id, id);
  assert.equal(next.students[23].xp, s.students[23].xp + t.xp);
  assert.equal(next.students[23].feed, s.students[23].feed + t.feed);
  assert.equal(next.students[23].completed, s.students[23].completed + 1);
  assert.equal(approveTask(next, t.id, id), next);
  assert.equal(classXp(next) - classXp(s), t.xp);
});
test("unassigned or missing student cannot receive rewards", () => {
  const s = initialState();
  s.tasks[0].assigned = [];
  assert.equal(approveTask(s, s.tasks[0].id, s.students[0].id), s);
  assert.equal(approveTask(s, s.tasks[0].id, "missing"), s);
});
test("feeding spends existing feed and never changes XP", () => {
  const s = initialState();
  s.students[0].feed = 0;
  const next = feedStudents(s);
  assert.equal(next.students[0].feed, 0);
  assert.equal(next.students[1].feed, s.students[1].feed - 1);
  assert.equal(classXp(next), classXp(s));
});
test("class progression crosses a real decoration threshold after approval", () => {
  const s = initialState();
  s.students.forEach((x) => (x.xp = 0));
  s.students[0].xp = decorThresholds[3] - 25;
  const next = approveTask(s, s.tasks[0].id, s.students[23].id);
  assert.ok(classXp(s) < decorThresholds[3]);
  assert.ok(classXp(next) >= decorThresholds[3]);
});
test("local state validates malformed and unsupported saves", () => {
  assert.equal(validState(initialState()), true);
  assert.equal(validState(null), false);
  assert.equal(validState({ version: 2 }), false);
  const s = initialState();
  s.students[0].fish = 99;
  assert.equal(validState(s), false);
});
test("40 swimmers remain finite and inside the aquarium through long pauses", () => {
  const fish = createSwimmers(40);
  for (let i = 0; i < 10000; i++)
    stepSwimmers(fish, i === 500 ? 100 : 1 / 60, i / 60);
  for (const f of fish) {
    assert.ok(Number.isFinite(f.x) && Number.isFinite(f.y));
    assert.ok(f.x >= 0.025 && f.x <= 0.975);
    assert.ok(f.y >= 0.05 && f.y <= 0.85);
  }
});
