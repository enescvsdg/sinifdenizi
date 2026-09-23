import { validState, type SchoolState, type Student } from "./model.ts";

export const storageKey = "sinifdenizi-v2";
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type LoadResult =
  | { status: "empty" }
  | { status: "loaded"; state: SchoolState }
  /** The saved record could not be read; it was moved to `backupKey`. */
  | { status: "backedUp"; backupKey: string }
  /** The saved record could not be read or moved aside: do not overwrite it. */
  | { status: "unreadable" }
  | { status: "unavailable" };

/** localStorage, or null where the browser blocks access (e.g. site data disabled). */
export function browserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function parse(raw: string): SchoolState | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!validState(value)) return null;
    // Older saves kept a separate `completed` counter; it is now read from the tasks.
    const students = (
      value.students as (Student & { completed?: unknown })[]
    ).map(({ completed: _legacy, ...student }) => student);
    return { ...value, students };
  } catch {
    return null;
  }
}

/** Reads the saved classroom. A record this version cannot read is never overwritten. */
export function loadState(store: Store | null, now = new Date()): LoadResult {
  if (!store) return { status: "unavailable" };
  let raw: string | null;
  try {
    raw = store.getItem(storageKey);
  } catch {
    return { status: "unavailable" };
  }
  if (raw === null) return { status: "empty" };
  const state = parse(raw);
  if (state) return { status: "loaded", state };
  const backupKey = `${storageKey}-yedek-${now.toISOString().slice(0, 19).replace(/\D/g, "")}`;
  try {
    // Moving rather than copying frees the space the backup needs.
    store.removeItem(storageKey);
    store.setItem(backupKey, raw);
    return { status: "backedUp", backupKey };
  } catch {
    try {
      // Put it back; its own space was freed a moment ago.
      store.setItem(storageKey, raw);
    } catch {
      // Storage stopped accepting writes altogether; nothing left to try.
    }
    return { status: "unreadable" };
  }
}

/** False when the browser refuses the write, usually because its quota is full. */
export function saveState(store: Store, state: SchoolState): boolean {
  try {
    store.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
