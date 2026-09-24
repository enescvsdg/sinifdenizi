const pad = (n: number) => String(n).padStart(2, "0");

/** YYYY-MM-DD of the local calendar day, the format of task due dates. */
export function localDay(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "25 Eylül" for a YYYY-MM-DD date or an ISO timestamp. */
export function formatDay(value: string) {
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

/** "5 dk önce", "Dün", "3 gün önce", then the date itself after a week. */
export function timeAgo(at: string, now: Date) {
  const minutes = Math.floor((now.getTime() - new Date(at).getTime()) / 60000);
  if (minutes < 1) return "Az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const noon = (date: Date) => new Date(`${localDay(date)}T12:00:00`).getTime();
  const days = Math.round((noon(now) - noon(new Date(at))) / 86400000);
  if (days === 0) return `${Math.floor(minutes / 60)} sa önce`;
  if (days === 1) return "Dün";
  if (days < 7) return `${days} gün önce`;
  return formatDay(at);
}

/** A task is overdue once its due day has passed. */
export const isOverdue = (due: string, now: Date) => due < localDay(now);
