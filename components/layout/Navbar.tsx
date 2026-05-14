"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

const services = [
  { label: "Airport Transfers", href: "/services#airport", desc: "Flight-tracked pickups" },
  { label: "Hourly Chauffeur", href: "/services#hourly", desc: "From 2 to 24 hours" },
  { label: "City-to-City Rides", href: "/services#city", desc: "Long distance in comfort" },
  { label: "Corporate Travel", href: "/services#corporate", desc: "Business travel solutions" },
  { label: "Event Transportation", href: "/services#events", desc: "Weddings, galas & more" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, loading, initials, displayName } = useUser();

  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const solidBg = isScrolled || !isHomePage;

  const navLinkClass = `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
    solidBg
      ? "text-gray-700 hover:text-[#0b66d1] hover:bg-blue-50"
      : "text-white/90 hover:bg-white/10 hover:text-white"
  }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solidBg
            ? "bg-white border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b66d1]">
              <Image
                src="/B Logo Black Theme.png"
                alt="BlackDrivo"
                width={24}
                height={24}
                className="object-contain invert mix-blend-screen"
              />
            </div>
            <span className={`text-xl font-bold tracking-tight md:text-2xl transition-colors ${solidBg ? "text-gray-900" : "text-white"}`}>
              BlackDrivo
            </span>
          </Link>

          {/* Desktop nav — left side */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Services dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1.5 ${navLinkClass}`}
              >
                Services
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        onClick={() => setServicesOpen(false)}
                        className="block rounded-xl px-4 py-3 transition hover:bg-blue-50"
                      >
                        <p className="text-sm font-medium text-gray-900">{s.label}</p>
                        <p className="text-xs text-gray-500">{s.desc}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className={navLinkClass}>About</Link>
            <Link href="/contact" className={navLinkClass}>Contact</Link>
            <Link href="/driver" className={navLinkClass}>For Drivers</Link>

            {/* "My Bookings" shown only when logged in */}
            {user && (
              <Link
                href="/user/dashboard"
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  solidBg
                    ? "text-[#0b66d1] hover:bg-blue-50"
                    : "text-white hover:bg-white/10"
                }`}
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Desktop right — Sign In / Profile + Book */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* Auth area — always occupies space, Sign in shown until auth resolves */}
            {user ? (
              <ProfileDropdown
                initials={initials}
                displayName={displayName}
                email={user.email ?? ""}
              />
            ) : (
              <Link
                href="/login"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  loading ? "opacity-0 pointer-events-none" : ""
                } ${
                  solidBg
                    ? "text-gray-700 hover:text-[#0b66d1] hover:bg-blue-50"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                Sign in
              </Link>
            )}
            <Link
              href="/booking"
              className="rounded-full bg-[#0b66d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8] active:scale-95"
            >
              Book now
            </Link>
          </div>

          {/* Mobile: Book + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/booking"
              className="rounded-full bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className={`rounded-lg p-2 transition ${solidBg ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-80 overflow-y-auto bg-white shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
                    <Image
                      src="/B Logo Black Theme.png"
                      alt="BlackDrivo"
                      width={18}
                      height={18}
                      className="object-contain invert mix-blend-screen"
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {/* Services */}
                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Services
                </p>
                {services.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#0b66d1]"
                  >
                    {s.label}
                  </Link>
                ))}

                <div className="my-3 border-t border-gray-100" />

                {/* Nav links */}
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "Become a Driver", href: "/driver" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#0b66d1]"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* My Bookings — authenticated only */}
                {user && (
                  <Link
                    href="/user/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-[#0b66d1] hover:bg-blue-50"
                  >
                    My Bookings
                  </Link>
                )}

                {/* Auth CTA */}
                <div className="mt-4 flex flex-col gap-2">
                  {user ? (
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                      <ProfileDropdown
                        initials={initials}
                        displayName={displayName}
                        email={user.email ?? ""}
                      />
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full border-2 border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
                    >
                      Sign in
                    </Link>
                  )}
                  <Link
                    href="/booking"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-[#0b66d1] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0952a8]"
                  >
                    Book a ride
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
