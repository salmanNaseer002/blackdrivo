// Currencies typically shown without decimal places (e.g. "Rs 1,000" not "Rs 1,000.00")
const ZERO_DECIMAL: Record<string, boolean> = { PKR: true };

export function formatMoney(amount: number, symbol = "$", currencyCode?: string): string {
  const decimals = currencyCode && ZERO_DECIMAL[currencyCode] ? 0 : 2;
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol} ${formatted}`;
}

// Strips non-digit characters from a booking_ref ("BD-A1B2C3D4") so the
// customer-facing ID reads as plain digits, matching Admin's `displayId()`.
export function displayBookingId(id: string | null | undefined): string {
  if (!id) return "—";
  const digits = String(id).replace(/\D/g, "");
  return digits || String(id);
}

// Converts a 24h "HH:MM" string to a 12h "h:mm AM/PM" label.
export function to12Hour(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}
