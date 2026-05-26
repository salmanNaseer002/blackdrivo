"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, Calendar, CreditCard, LogOut, ChevronDown, Car, UserCircle, LayoutDashboard, Loader2 } from "lucide-react";

interface Props {
  initials: string;
  displayName: string;
  email: string;
  role?: string;
}

export default function ProfileDropdown({ initials, displayName, email, role = "user" }: Props) {
  const [open, setOpen]           = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    if (signingOut) return;
    setOpen(false);
    setSigningOut(true);
    try {
      // Call the server-side signout route — this clears HTTP cookies
      // so the Next.js middleware sees no valid session immediately.
      await fetch("/api/auth/signout", { method: "POST", redirect: "manual" });
    } catch {
      // Ignore network errors — we'll still redirect
    }
    // Hard redirect so the browser sends a fresh request through middleware
    window.location.replace("/");
  };

  const firstName = displayName.split(" ")[0];

  const driverMenuItems = [
    { icon: LayoutDashboard, label: "My Dashboard",  href: "/driver/dashboard" },
    { icon: UserCircle,      label: "As Passenger",  href: "/user/dashboard"   },
  ];

  const userMenuItems = [
    { icon: User,       label: "Profile Settings", href: "/user/profile"  },
    { icon: Calendar,   label: "My Bookings",      href: "/user/dashboard" },
    { icon: CreditCard, label: "Payment History",  href: "/user/payments"  },
  ];

  const menuItems = role === "driver" ? driverMenuItems : userMenuItems;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-gray-300 hover:shadow"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b66d1] text-xs font-bold text-white">
          {initials}
        </div>
        <span className="hidden text-sm font-medium text-gray-700 md:flex md:items-center gap-1">
          {firstName}
          {role === "driver" && (
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#0b66d1]">Driver</span>
          )}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            {/* Header */}
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b66d1] text-sm font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                    {role === "driver" && (
                      <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#0b66d1]">Driver</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-gray-500">{email}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="p-1.5">
              {menuItems.map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-gray-900">
                  <item.icon className="h-4 w-4 text-gray-400" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <div className="border-t border-gray-100 p-1.5">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                {signingOut
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <LogOut className="h-4 w-4" />
                }
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
