import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState } from "../lib/model.ts";
import { loadState, saveState, storageKey } from "../lib/storage.ts";

/** In-memory Storage that, like a browser, refuses writes beyond a quota. */
function memoryStore(quota = Infinity) {
  const items = new Map<string, string>();
  const used = () =>
    [...items].reduce((n, [key, value]) => n + key.length + value.length, 0);
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem(key: string, value: string) {
      const old = items.get(key);
      const freed = old === undefined ? 0 : key.length + old.length;
      if (used() - freed + key.length + value.length > quota)
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      items.set(key, value);
    },
    removeItem: (key: string) => void items.delete(key),
  };
}

test("a saved classroom loads without the retired completed counter", () => {
  const store = memoryStore(),
    s = initialState();
  const legacy = {
    ...s,
    students: s.students.map((x) => ({ ...x, completed: 9 })),
  };
  store.setItem(storageKey, JSON.stringify(legacy));
  const result = loadState(store);
  assert.equal(result.status, "loaded");
  if (result.status === "loaded") {
    assert.equal(result.state.students.length, s.students.length);
    assert.ok(result.state.students.every((x) => !("completed" in x)));
  }
  assert.equal(loadState(memoryStore()).status, "empty");
});

test("an unreadable save is moved to a backup instead of being overwritten", () => {
  const unsupported = JSON.stringify({ ...initialState(), version: 3 });
  for (const raw of ["{not json", unsupported]) {
    const store = memoryStore();
    store.setItem(storageKey, raw);
    const result = loadState(store, new Date("2026-09-23T10:15:30Z"));
    const backupKey = `${storageKey}-yedek-20260923101530`;
    assert.deepEqual(result, { status: "backedUp", backupKey });
    assert.equal(store.getItem(backupKey), raw);
    assert.equal(store.getItem(storageKey), null);
  }
});

test("a save that cannot be backed up stays where it was", () => {
  const raw = "{broken";
  // Exactly enough room for the record under its own (shorter) key.
  const store = memoryStore(storageKey.length + raw.length);
  store.setItem(storageKey, raw);
  assert.equal(loadState(store).status, "unreadable");
  assert.equal(store.getItem(storageKey), raw);
});

test("blocked storage is reported as unavailable", () => {
  assert.equal(loadState(null).status, "unavailable");
  const blocked = {
    getItem(): string | null {
      throw new DOMException("Access denied", "SecurityError");
    },
    setItem() {},
    removeItem() {},
  };
  assert.equal(loadState(blocked).status, "unavailable");
});

test("saving reports a full quota instead of throwing", () => {
  const full = memoryStore(1000);
  assert.equal(saveState(full, initialState()), false);
  assert.equal(full.getItem(storageKey), null);
  const roomy = memoryStore();
  assert.equal(saveState(roomy, initialState()), true);
  assert.equal(loadState(roomy).status, "loaded");
});
