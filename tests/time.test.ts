import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDay, isOverdue, localDay, timeAgo } from "../lib/time.ts";

test("relative times read naturally and fall back to the date", () => {
  const now = new Date(2026, 8, 24, 10, 0);
  const ago = (minutes: number) =>
    timeAgo(new Date(now.getTime() - minutes * 60000).toISOString(), now);
  assert.equal(ago(0), "Az önce");
  assert.equal(ago(-5), "Az önce");
  assert.equal(ago(12), "12 dk önce");
  assert.equal(ago(125), "2 sa önce");
  assert.equal(timeAgo(new Date(2026, 8, 23, 18, 0).toISOString(), now), "Dün");
  assert.equal(
    timeAgo(new Date(2026, 8, 20, 9, 0).toISOString(), now),
    "4 gün önce",
  );
  assert.equal(
    timeAgo(new Date(2026, 8, 1, 9, 0).toISOString(), now),
    "1 Eylül",
  );
});

test("due dates use the local calendar day", () => {
  assert.equal(localDay(new Date(2026, 8, 24, 0, 30)), "2026-09-24");
  assert.equal(formatDay("2026-09-25"), "25 Eylül");
  const evening = new Date(2026, 8, 24, 23, 59);
  assert.equal(isOverdue("2026-09-24", evening), false);
  assert.equal(isOverdue("2026-09-23", evening), true);
});
