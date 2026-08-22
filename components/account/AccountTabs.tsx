"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Flat underline tabs — same pattern as Admin's dashboard date-range filter
// (bottom border in accent color when active, plain muted text otherwise,
// no pill/background), not the boxed pill-card links this replaced.
const TABS = [
  { label: "Account",           href: "/account" },
  { label: "Journey",           href: "/journey" },
  { label: "Offers & Rewards",  href: "/offers" },
  { label: "Corporate",         href: "/corporate" },
];

export default function AccountTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {TABS.map((t) => {
        const active = pathname === t.href || (t.href !== "/account" && pathname?.startsWith(`${t.href}/`));
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
              active ? "border-[#0b66d1] text-[#0b66d1]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
