// Local calendar date arithmetic (not UTC) — `toISOString()` reads UTC and
// can land a real day behind for regions ahead of UTC around midnight, the
// same class of bug flagged elsewhere in this project (see SHARED_CONTEXT.md
// "UTC vs Local Date"). Ported from PassApp's CorporateHome.js isoOf/addDays.
export function isoOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return isoOf(d);
}

export function todayIso(): string {
  return isoOf(new Date());
}

export function dateLabel(iso: string, today: string): string {
  const tomorrow = addDays(today, 1);
  if (iso === today) return "Today";
  if (iso === tomorrow) return "Tomorrow";
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}
