"use client";
import { useSyncExternalStore } from "react";
import { formatDay, timeAgo } from "@/lib/time";

// One clock, ticking every minute, for every timestamp on the page.
let now: Date | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    const tick = () => {
      now = new Date();
      listeners.forEach((notify) => notify());
    };
    tick();
    timer = setInterval(tick, 60_000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) clearInterval(timer);
  };
}

/**
 * The current time, refreshed every minute. It is null while the page
 * hydrates so prerendered HTML never depends on the build date.
 */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}

export function TimeAgo({ at }: { at: string }) {
  const now = useNow();
  return (
    <time dateTime={at} title={new Date(at).toLocaleString("tr-TR")}>
      {now ? timeAgo(at, now) : formatDay(at)}
    </time>
  );
}
