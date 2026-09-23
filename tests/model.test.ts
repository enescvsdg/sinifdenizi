import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  approveTask,
  feedStudents,
  classXp,
  validState,
  decorThresholds,
  completedCounts,
  earnedBadges,
  removeStudent,
  updateStudent,
} from "../lib/model.ts";
import { createSwimmers, stepSwimmers } from "../lib/swimming.ts";
test("approval rewards the assigned student exactly once", () => {
  const s = initialState(),
    id = s.students[23].id,
    t = s.tasks[0],
    next = approveTask(s, t.id, id);
  assert.equal(next.students[23].xp, s.students[23].xp + t.xp);
  assert.equal(next.students[23].feed, s.students[23].feed + t.feed);
  assert.equal(
    completedCounts(next).get(id),
    (completedCounts(s).get(id) ?? 0) + 1,
  );
  assert.equal(approveTask(next, t.id, id), next);
  assert.equal(classXp(next) - classXp(s), t.xp);
});
test("the sample classroom agrees with its own task records", () => {
  const s = initialState(),
    counts = completedCounts(s);
  for (const student of s.students) {
    const done = s.tasks.filter((t) => t.done.includes(student.id));
    assert.equal(counts.get(student.id) ?? 0, done.length);
    assert.equal(student.xp, done.reduce((sum, t) => sum + t.xp, 0));
  }
  assert.ok(s.tasks.every((t) => t.done.every((id) => t.assigned.includes(id))));
  assert.deepEqual(earnedBadges(4).map((b) => b.name), ["İlk adım"]);
  assert.equal(earnedBadges(5).length, 2);
  assert.equal(earnedBadges(0).length, 0);
});
test("removing a student clears their records and tasks given only to them", () => {
  const s = initialState(),
    id = s.students[0].id,
    other = s.students[1].id;
  const solo = { ...s.tasks[0], id: "solo", assigned: [id], done: [id] };
  const before = { ...s, tasks: [solo, ...s.tasks] };
  const next = removeStudent(before, id);
  assert.equal(next.students.length, s.students.length - 1);
  assert.equal(next.tasks.length, s.tasks.length);
  assert.ok(
    next.tasks.every((t) => !t.assigned.includes(id) && !t.done.includes(id)),
  );
  assert.equal(completedCounts(next).get(other), completedCounts(before).get(other));
  assert.ok(next.activities.every((a) => a.studentId !== id));
  assert.ok(next.activities.some((a) => a.studentId === other));
  assert.equal(removeStudent(next, id), next);
  assert.equal(validState(next), true);
});
test("editing a student trims the name and replaces or removes the photo", () => {
  const s = initialState(),
    id = s.students[2].id,
    photo = "data:image/webp;base64,UklGRg==";
  const edited = updateStudent(s, id, { name: "  Eren Deniz  ", photo });
  assert.equal(edited.students[2].name, "Eren Deniz");
  assert.equal(edited.students[2].photo, photo);
  assert.equal(edited.students[2].xp, s.students[2].xp);
  const cleared = updateStudent(edited, id, { name: "Eren Deniz" });
  assert.equal("photo" in cleared.students[2], false);
  assert.equal(updateStudent(s, id, { name: "   " }), s);
  assert.equal(updateStudent(s, "missing", { name: "Ada" }), s);
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
  const remote = initialState();
  remote.students[0].photo = "https://example.com/pixel.png";
  assert.equal(validState(remote), false);
  // Saves from before counts were read from tasks still open.
  const legacy = initialState();
  Object.assign(legacy.students[0], { completed: 9 });
  assert.equal(validState(legacy), true);
});
test("40 swimmers remain finite and inside the aquarium through long pauses", () => {
  const fish = createSwimmers(40, Array.from({ length: 40 }, (_, i) => i % 30));
  for (let i = 0; i < 10000; i++)
    stepSwimmers(fish, i === 500 ? 100 : 1 / 60, i / 60);
  for (const f of fish) {
    assert.ok(Number.isFinite(f.x) && Number.isFinite(f.y));
    assert.ok(f.x >= 0.025 && f.x <= 0.975);
    assert.ok(f.y >= 0.05 && f.y <= 0.85);
  }
});
