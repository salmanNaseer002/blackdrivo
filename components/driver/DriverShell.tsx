"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Car, Calendar, FileText, LogOut,
  Menu, Bell, Star, Hash, AlertCircle, CheckCircle,
  Clock, ToggleLeft, ToggleRight, UserCircle, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calcDriverCompletion } from "@/lib/utils/driverCompletion";
import { toast } from "sonner";
import { DRIVER_THEME, ini } from "@/lib/driver/theme";

const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { label: "Overview",   href: "/driver/dashboard/overview",  icon: LayoutDashboard },
    ],
  },
  {
    label: "MY ACCOUNT",
    items: [
      { label: "My Profile", href: "/driver/dashboard/profile",   icon: User      },
      { label: "My Vehicle", href: "/driver/dashboard/vehicle",   icon: Car       },
      { label: "My Rides",   href: "/driver/dashboard/rides",     icon: Calendar  },
      { label: "Documents",  href: "/driver/dashboard/documents", icon: FileText  },
    ],
  },
];

export default function DriverShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [mounted,       setMounted]       = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [driver,        setDriver]        = useState<any>(null);
  const [vehicle,       setVehicle]       = useState<any>(null);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [alerts,        setAlerts]        = useState<{ type: string; msg: string }[]>([]);
  const [isAvailable,   setIsAvailable]   = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login?redirect=/driver/dashboard/overview"); return; }

      const { data: drv } = await supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle();
      if (!drv) { router.replace("/driver/signup"); return; }
      setDriver(drv);
      setIsAvailable(drv.is_available ?? false);

      const [{ data: veh }, { data: bookings }] = await Promise.all([
        supabase.from("driver_vehicles").select("*").eq("driver_id", drv.id).eq("is_active", true).maybeSingle(),
        supabase.from("bookings").select("id,status").eq("driver_id", drv.id),
      ]);
      setVehicle(veh);
      setUpcomingCount((bookings || []).filter(r => ["confirmed", "in_progress", "pending"].includes(r.status)).length);

      const a: { type: string; msg: string }[] = [];
      const comp = calcDriverCompletion(drv, veh);
      if (comp.percentage < 100) a.push({ type: "warning", msg: `Profile ${comp.percentage}% complete — ${comp.missing.length} items missing` });
      if (drv.license_expiry) {
        const diff = Math.ceil((new Date(drv.license_expiry).getTime() - Date.now()) / 86400000);
        if (diff < 60) a.push({ type: diff < 14 ? "error" : "warning", msg: `License expires in ${diff} days` });
      }
      if (drv.status === "rejected") a.push({ type: "error", msg: "Application rejected — check your profile" });
      if (drv.status === "pending" && comp.percentage === 100) a.push({ type: "info", msg: "Application under review — 2–3 business days" });
      setAlerts(a);
      setLoading(false);
    };
    load();
  }, [router]);

  const toggleAvail = useCallback(async () => {
    if (!driver) return;
    const next = !isAvailable;
    setIsAvailable(next);
    const supabase = createClient();
    const { error } = await supabase.from("drivers").update({ is_available: next }).eq("id", driver.id);
    if (error) { setIsAvailable(!next); toast.error("Could not update"); }
    else toast.success(next ? "You're now online" : "You're now offline");
  }, [driver, isAvailable]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const driverName = driver?.full_name && driver.full_name !== "PENDING"
    ? driver.full_name : driver?.email?.split("@")[0] || "Driver";

  if (!mounted || loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 shadow-lg">
          <Car className="h-6 w-6 text-white" />
        </div>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-gray-200">
          <div className="h-1 w-1/2 animate-pulse rounded-full bg-gray-900" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={150} height={22} className="object-contain" />
        </Link>
      </div>

      {/* Driver card */}
      <div className="border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
            {ini(driverName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{driverName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Star className="h-3 w-3" />
                {driver?.rating ? driver.rating.toFixed(1) : "—"}
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Hash className="h-3 w-3" />
                {driver?.total_rides ?? 0}
              </span>
            </div>
          </div>
          {/* Online dot */}
          <div className={`h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-gray-300"}`} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className={`${DRIVER_THEME.sidebar.label} px-3 mb-1`}>{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      active ? DRIVER_THEME.sidebar.active : DRIVER_THEME.sidebar.inactive
                    }`}>
                    <span className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 shrink-0 ${active ? DRIVER_THEME.sidebar.activeIcon : DRIVER_THEME.sidebar.icon}`} />
                      {item.label}
                    </span>
                    {item.label === "My Rides" && upcomingCount > 0 && (
                      <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                        active ? "bg-[#0b66d1] text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {upcomingCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 px-3 py-3 space-y-0.5">
        <a href="mailto:support@blackdrivo.com"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition">
          <AlertCircle className="h-4 w-4 shrink-0 text-gray-400" /> Support
        </a>
        <button onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition">
          <LogOut className="h-4 w-4 shrink-0 text-gray-400" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col overflow-hidden">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-56 lg:hidden shadow-xl">
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                {NAV_SECTIONS.flatMap(s => s.items).find(n => pathname === n.href)?.label ?? "Dashboard"}
              </h1>
              <p className="hidden sm:block text-xs text-gray-400">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Online toggle */}
            <button onClick={toggleAvail}
              className={`hidden sm:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                isAvailable
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}>
              {isAvailable
                ? <><ToggleRight className="h-4 w-4" /> Online</>
                : <><ToggleLeft className="h-4 w-4" /> Offline</>
              }
            </button>

            {/* As Passenger */}
            <Link href="/user/dashboard"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
              <UserCircle className="h-3.5 w-3.5" /> As Passenger
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">
                <Bell className="h-4 w-4" />
                {alerts.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {alerts.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                        <button onClick={() => setNotifOpen(false)}><X className="h-4 w-4 text-gray-400" /></button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {alerts.length === 0 ? (
                          <div className="py-8 text-center">
                            <CheckCircle className="mx-auto mb-2 h-7 w-7 text-gray-200" />
                            <p className="text-sm text-gray-400">No alerts</p>
                          </div>
                        ) : alerts.map((a, i) => (
                          <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                            {a.type === "error"
                              ? <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                              : a.type === "warning"
                              ? <Clock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                              : <Bell className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                            }
                            <p className="text-xs text-gray-700 leading-relaxed">{a.msg}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
              {ini(driverName)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
          {children}
        </main>
      </div>
    </div>
  );
}
