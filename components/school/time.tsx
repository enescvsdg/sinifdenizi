"use client";
import { useEffect, useState } from "react";
import { formatDay, timeAgo } from "@/lib/time";

/**
 * The current time, refreshed every minute. It is null during the first
 * render so prerendered HTML never depends on the build date.
 */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export function TimeAgo({ at }: { at: string }) {
  const now = useNow();
  return (
    <time dateTime={at} title={new Date(at).toLocaleString("tr-TR")}>
      {now ? timeAgo(at, now) : formatDay(at)}
    </time>
  );
}
