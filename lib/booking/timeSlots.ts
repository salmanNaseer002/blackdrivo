// Bookings must be made at least 3 hours ahead of the current time.
export const MIN_LEAD_HOURS = 3;

export function getEarliestBookableDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTimeSlots(dateStr: string): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  const now = new Date();
  const isToday = dateStr === now.toISOString().split("T")[0];

  const minTime = new Date(now.getTime() + MIN_LEAD_HOURS * 60 * 60 * 1000);

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (isToday) {
        const slotDate = new Date(now);
        slotDate.setHours(h, m, 0, 0);
        if (slotDate < minTime) continue;
      }
      const period = h >= 12 ? "PM" : "AM";
      const hh = h % 12 === 0 ? 12 : h % 12;
      slots.push({
        value: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        label: `${hh}:${String(m).padStart(2, "0")} ${period}`,
      });
    }
  }
  return slots;
}

// Same 6 period buckets PassApp's DateTimePicker.jsx groups slots into
// (Early Morning / Morning / Midday / Afternoon / Evening / Night), so the
// website's time picker reads the same way as the mobile app's.
const PERIODS: { label: string; from: number; to: number }[] = [
  { label: "Early Morning", from: 0, to: 8 },
  { label: "Morning", from: 8, to: 11 },
  { label: "Midday", from: 11, to: 14 },
  { label: "Afternoon", from: 14, to: 17 },
  { label: "Evening", from: 17, to: 20 },
  { label: "Night", from: 20, to: 24 },
];

export function getGroupedTimeSlots(
  dateStr: string
): { label: string; slots: { value: string; label: string }[] }[] {
  const flat = getTimeSlots(dateStr);
  return PERIODS.map((p) => ({
    label: p.label,
    slots: flat.filter((s) => {
      const h = Number(s.value.slice(0, 2));
      return h >= p.from && h < p.to;
    }),
  })).filter((g) => g.slots.length > 0);
}
