export function isSameDay(isoA: string, isoB: string): boolean {
  return isoA.slice(0, 10) === isoB.slice(0, 10);
}

export function isToday(iso: string): boolean {
  return isSameDay(iso, new Date().toISOString());
}

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isWithinLastDays(iso: string, days: number): boolean {
  const target = new Date(iso).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return target >= cutoff;
}
