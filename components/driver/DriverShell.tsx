"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Car, Calendar, FileText, LogOut,
  Menu, X, Bell, Star, Hash, AlertCircle, CheckCircle,
  Clock, ToggleLeft, ToggleRight, UserCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calcDriverCompletion } from "@/lib/utils/driverCompletion";
import { toast } from "sonner";

const NAV = [
  { label: "Overview",   href: "/driver/dashboard/overview",  icon: LayoutDashboard },
  { label: "My Profile", href: "/driver/dashboard/profile",   icon: User            },
  { label: "My Vehicle", href: "/driver/dashboard/vehicle",   icon: Car             },
  { label: "My Rides",   href: "/driver/dashboard/rides",     icon: Calendar        },
  { label: "Documents",  href: "/driver/dashboard/documents", icon: FileText        },
];

function ini(name: string) {
  return (name || "D").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

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

      const [{ data: drv }, ] = await Promise.all([
        supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (!drv) { router.replace("/driver/signup"); return; }

      setDriver(drv);
      setIsAvailable(drv.is_available ?? false);

      const [{ data: veh }, { data: bookings }] = await Promise.all([
        supabase.from("driver_vehicles").select("*").eq("driver_id", drv.id).eq("is_active", true).maybeSingle(),
        supabase.from("bookings").select("id,status").eq("driver_id", drv.id),
      ]);

      setVehicle(veh);
      setUpcomingCount((bookings || []).filter(r => ["confirmed", "in_progress", "pending"].includes(r.status)).length);

      // Build alerts
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
    ? driver.full_name
    : driver?.email?.split("@")[0] || "Driver";

  if (!mounted || loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b66d1]/5">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b66d1] shadow-lg shadow-[#0b66d1]/30">
          <Car className="h-7 w-7 text-white" />
        </div>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-[#0b66d1]/20">
          <div className="h-1 w-1/2 animate-[slide_1s_ease-in-out_infinite] rounded-full bg-[#0b66d1]" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-[#0b66d1]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={22} height={22} className="object-contain invert brightness-0 invert" />
          <span className="text-lg font-bold text-white tracking-tight">BlackDrivo</span>
        </Link>
      </div>

      {/* Driver card */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="rounded-xl bg-white/10 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
              {ini(driverName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{driverName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Star className="h-3 w-3" />
                  {driver?.rating ? driver.rating.toFixed(1) : "—"}
                </span>
                <span className="text-white/30">·</span>
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Hash className="h-3 w-3" />
                  {driver?.total_rides ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Online toggle */}
          <button onClick={toggleAvail}
            className={`mt-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              isAvailable
                ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                : "bg-white/10 text-white/50 hover:bg-white/20"
            }`}>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`} />
              <span>{isAvailable ? "Online" : "Offline"}</span>
            </div>
            {isAvailable
              ? <ToggleRight className="h-5 w-5 text-emerald-400" />
              : <ToggleLeft className="h-5 w-5 text-white/40" />
            }
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white text-[#0b66d1] shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}>
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </span>
              {item.label === "My Rides" && upcomingCount > 0 && (
                <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  active ? "bg-[#0b66d1] text-white" : "bg-white/20 text-white"
                }`}>
                  {upcomingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 px-3 py-3 space-y-0.5">
        <a href="mailto:support@blackdrivo.com"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition">
          <AlertCircle className="h-4 w-4 shrink-0" /> Support
        </a>
        <button onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition">
          <LogOut className="h-4 w-4 shrink-0" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col overflow-hidden">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden overflow-hidden shadow-2xl">
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 md:px-6 gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-gray-900">
                {NAV.find(n => pathname === n.href)?.label ?? "Dashboard"}
              </h1>
              <p className="hidden sm:block text-xs text-gray-400">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* As Passenger switch */}
            <Link href="/user/dashboard"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition">
              <UserCircle className="h-3.5 w-3.5" />
              As Passenger
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">
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
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                        {alerts.length > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {alerts.length}
                          </span>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {alerts.length === 0 ? (
                          <div className="py-8 text-center">
                            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                            <p className="text-sm text-gray-400">All good — no alerts</p>
                          </div>
                        ) : alerts.map((a, i) => (
                          <div key={i} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0`}>
                            {a.type === "error"
                              ? <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                              : a.type === "warning"
                              ? <Clock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                              : <Bell className="h-4 w-4 shrink-0 text-[#0b66d1] mt-0.5" />
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
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b66d1] text-xs font-bold text-white">
              {ini(driverName)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
