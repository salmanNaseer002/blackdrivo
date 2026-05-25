// ─────────────────────────────────────────────────────────────
//  Driver Portal — Central Theme Config
//  Matches BlackDrivo Admin Portal style
// ─────────────────────────────────────────────────────────────

export const DRIVER_THEME = {
  // ── Brand ─────────────────────────────────────────────────
  primary:      "#0b66d1",
  primaryDark:  "#0952a8",
  primaryLight: "#e8f1fd",

  // ── Sidebar — white, clean, admin-style ───────────────────
  sidebar: {
    bg:       "#ffffff",
    border:   "border-r border-gray-200",
    active:   "bg-blue-50 text-[#0b66d1]",
    inactive: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    icon:     "text-gray-400",
    activeIcon:"text-[#0b66d1]",
    label:    "text-[11px] font-semibold uppercase tracking-widest text-gray-400",
  },

  // ── Page ──────────────────────────────────────────────────
  pageBg:      "bg-[#f5f5f5]",
  pageWrapper: "p-5 md:p-6 space-y-5",
  pageTitle:   "text-xl font-bold text-gray-900",
  pageSub:     "text-sm text-gray-400 mt-0.5",

  // ── Cards ─────────────────────────────────────────────────
  card:        "rounded-xl border border-gray-200 bg-white",
  cardHeader:  "flex items-center justify-between border-b border-gray-100 px-5 py-4",

  // ── Typography ────────────────────────────────────────────
  fieldLabel:  "text-xs font-medium text-gray-400 uppercase tracking-wide",
  fieldValue:  "mt-1 text-sm font-medium text-gray-900",

  // ── Buttons ───────────────────────────────────────────────
  btnPrimary:   "flex items-center gap-2 rounded-lg bg-[#0b66d1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0952a8] transition",
  btnDark:      "flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition",
  btnSecondary: "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition",
  btnGhost:     "text-xs font-medium text-[#0b66d1] hover:underline",

  // ── Status badges ─────────────────────────────────────────
  driverStatus: {
    approved:  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
    pending:   { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-200"  },
    rejected:  { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500",     border: "border-red-200"    },
    suspended: { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400",    border: "border-gray-200"   },
  },

  // ── Ride status ───────────────────────────────────────────
  rideStatus: {
    confirmed:   { label: "Confirmed",   bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500"    },
    in_progress: { label: "In Progress", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500"   },
    completed:   { label: "Completed",   bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    cancelled:   { label: "Cancelled",   bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400"     },
    pending:     { label: "Pending",     bg: "bg-gray-50",    text: "text-gray-500",    dot: "bg-gray-400"    },
  },
} as const;

// ── Helpers ───────────────────────────────────────────────────

export function getDriverStatus(status: string) {
  return DRIVER_THEME.driverStatus[status as keyof typeof DRIVER_THEME.driverStatus]
    ?? DRIVER_THEME.driverStatus.pending;
}

export function getRideStatus(status: string) {
  return DRIVER_THEME.rideStatus[status as keyof typeof DRIVER_THEME.rideStatus]
    ?? DRIVER_THEME.rideStatus.pending;
}

export function curr(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function fmtDate(d: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-US", opts ?? { year: "numeric", month: "long", day: "numeric" }); }
  catch { return d; }
}

export function fmtShort(d: string | null) {
  return fmtDate(d, { month: "short", day: "numeric", year: "numeric" });
}

export function fmtDateTime(d: string | null) {
  return fmtDate(d, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function daysUntil(d: string | null): number | null {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
}

export function ini(name: string) {
  return (name || "D").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
