"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Smartphone, Apple, User, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { useSiteCountry } from "@/components/providers/CountryProvider";
import type { SiteCountry } from "@/lib/booking/country";

// TODO: Apne actual App Store aur Play Store links yahan daal dein
const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.blackdrivo.app";

const services = [
  { label: "Airport Transfers",    href: "/services#airport",   desc: "Flight-tracked pickups"      },
  { label: "Hourly Chauffeur",     href: "/services#hourly",    desc: "From 2 to 24 hours"          },
  { label: "City-to-City Rides",   href: "/services#city",      desc: "Long distance in comfort"    },
  { label: "Corporate Travel",     href: "/services#corporate", desc: "Business travel solutions"   },
  { label: "Event Transportation", href: "/services#events",    desc: "Weddings, galas & more"      },
];

export default function Navbar() {
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [countryOpen,  setCountryOpen]  = useState(false);
  const [countryOpenMobile, setCountryOpenMobile] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [showFloatingBook, setShowFloatingBook] = useState(false);
  const [pendingCountry, setPendingCountry] = useState<SiteCountry | null>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const countryRef  = useRef<HTMLDivElement>(null);
  const countryRefMobile = useRef<HTMLDivElement>(null);
  const pathname    = usePathname();
  const { user, profile, loading, isDriver, initials, displayName } = useUser();
  const { country, countries, setCountry } = useSiteCountry();

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
      if (!countryRef.current?.contains(e.target as Node)) setCountryOpen(false);
      if (!countryRefMobile.current?.contains(e.target as Node)) setCountryOpenMobile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Shows a floating "Book" button on mobile once the hero BookingWidget scrolls out of view
  useEffect(() => {
    const target = document.getElementById("booking-widget");
    if (!target) {
      setShowFloatingBook(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBook(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [pathname]);

  const solidBg = isScrolled || !isHomePage;

  // Returns true when the current path matches this nav item
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  const navLinkClass = (href: string) => {
    const active = isActive(href);
    return `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
      solidBg
        ? active
          ? "text-[#0b66d1] bg-blue-50 font-semibold"
          : "text-gray-700 hover:text-[#0b66d1] hover:bg-blue-50"
        : active
          ? "text-white bg-white/20 font-semibold"
          : "text-white/90 hover:bg-white/10 hover:text-white"
    }`;
  };

  const mobileNavLinkClass = (href: string) => {
    const active = isActive(href);
    return `rounded-xl px-3 py-3 text-sm font-medium transition ${
      active
        ? "bg-blue-50 text-[#0b66d1] font-semibold"
        : "text-gray-700 hover:bg-blue-50 hover:text-[#0b66d1]"
    }`;
  };

  const dashboardHref  = "/driver/dashboard";
  const dashboardLabel = "My Rides";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solidBg ? "bg-white border-b border-gray-100 shadow-sm" : "bg-transparent"}`}>
        <div className="flex h-16 w-full items-center justify-between px-6 md:h-20 md:px-10 lg:px-16">

          {/* Hamburger (mobile only, far left) + Logo */}
          <div className="flex items-center gap-2.5">
            <button onClick={() => setMobileOpen(true)} className={`rounded-lg p-2 transition lg:hidden ${solidBg ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}>
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex items-center shrink-0">
            <Image
            src={solidBg ? "/logo bb.png" : "/logo wb.png"}
            alt="BlackDrivo"
            width={140}
            height={40}
            className="object-contain transition-all duration-300"/>
            </Link>
          </div>

          {/* Everything else — one right-aligned group, no centered nav */}
          <div className="hidden items-center gap-1 lg:flex">
            <nav className="mr-[6.25rem] flex items-center gap-1">
              <Link href="/about" className={navLinkClass("/about")}>About</Link>

              <div className="relative" ref={servicesRef}>
                <button onClick={() => setServicesOpen(!servicesOpen)} className={`flex items-center gap-1.5 ${navLinkClass("/services")}`}>
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
                      {services.map(s => (
                        <Link key={s.label} href={s.href} onClick={() => setServicesOpen(false)}
                          className="block rounded-xl px-4 py-3 transition hover:bg-blue-50">
                          <p className="text-sm font-medium text-gray-900">{s.label}</p>
                          <p className="text-xs text-gray-500">{s.desc}</p>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/fleet"   className={navLinkClass("/fleet")}>Fleet</Link>
              <Link href="/contact" className={navLinkClass("/contact")}>Corporate</Link>
              <Link href="/contact" className={navLinkClass("/contact")}>Contact</Link>
              <Link href="/driver"   className={navLinkClass("/driver")}>Drive with Us</Link>

              {user && isDriver && (
                <Link href={dashboardHref} className={navLinkClass(dashboardHref)}>
                  {dashboardLabel}
                </Link>
              )}
            </nav>

            {/* Region helpline — shows the number for whichever country the site is currently set to */}
            {country.helpline_number && (
              <a
                href={`tel:${country.helpline_number.replace(/[^\d+]/g, "")}`}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  solidBg ? "text-gray-700 hover:text-[#0b66d1]" : "text-white/90 hover:text-white"
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                {country.helpline_number}
              </a>
            )}

            <div className="ml-1 flex items-center gap-2">
              <Link href="/#book" className="rounded-full bg-[#0b66d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8] active:scale-95">
                Book now
              </Link>

              {/* Sign-in / Account — far right */}
              {!loading && (
                user ? (
                  <ProfileDropdown initials={initials} displayName={displayName} email={user.email ?? ""} isDriver={isDriver} avatarUrl={profile?.avatar_url} />
                ) : (
                  <Link
                    href="/login"
                    title="Sign in"
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      solidBg
                        ? "border-gray-200 text-gray-700 hover:border-[#0b66d1] hover:text-[#0b66d1]"
                        : "border-white/30 text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </Link>
                )
              )}

              {/* Region flag — right of sign-in, flat (no border/pill), flag + dropdown chevron */}
              {countries.length > 1 && (
                <div className="relative" ref={countryRef}>
                  <button
                    onClick={() => setCountryOpen((v) => !v)}
                    title={country.name}
                    className={`flex items-center gap-1 rounded-lg px-1.5 py-1.5 text-lg transition ${
                      solidBg ? "hover:bg-gray-100" : "hover:bg-white/10"
                    }`}
                  >
                    {country.flag}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${solidBg ? "text-gray-500" : "text-white/80"} ${countryOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {countryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                      >
                        {countries.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setCountryOpen(false); if (c.code !== country.code) setPendingCountry(c); }}
                            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${
                              c.code === country.code ? "font-semibold text-[#0b66d1]" : "text-gray-700"
                            }`}
                          >
                            <span className="text-base">{c.flag}</span>
                            {c.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Mobile — Book button joins in once the hero booking widget scrolls out of view */}
          <div className="flex items-center lg:hidden">
            {showFloatingBook && (
              <Link
                href="/#book"
                className="rounded-full bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0952a8]"
              >
                Book
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto bg-white shadow-2xl"
            >
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
                    <Image src="/logo bb.png" alt="BlackDrivo" width={130} height={36} className="object-contain" />
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  {!loading && (
                    user ? (
                      <ProfileDropdown initials={initials} displayName={displayName} email={user.email ?? ""} isDriver={isDriver} avatarUrl={profile?.avatar_url} fullWidth />
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex w-fit items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
                      >
                        <User className="h-4 w-4" /> Sign in
                      </Link>
                    )
                  )}
                </div>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {country.helpline_number && (
                  <a href={`tel:${country.helpline_number.replace(/[^\d+]/g, "")}`}
                    className="mb-1 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-3 text-sm font-semibold text-[#0b66d1]">
                    <Phone className="h-4 w-4" /> {country.helpline_number}
                  </a>
                )}

                {countries.length > 1 && (
                  <div className="relative mb-2" ref={countryRefMobile}>
                    <button onClick={() => setCountryOpenMobile((v) => !v)} title={country.name}
                      className="flex w-fit items-center gap-1 rounded-lg px-1.5 py-1.5 text-lg transition hover:bg-gray-100">
                      {country.flag}
                      <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${countryOpenMobile ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {countryOpenMobile && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden pl-2"
                        >
                          {countries.map((c) => (
                            <button key={c.code}
                              onClick={() => { setCountryOpenMobile(false); if (c.code !== country.code) setPendingCountry(c); }}
                              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${
                                c.code === country.code ? "font-semibold text-[#0b66d1]" : "text-gray-600"
                              }`}>
                              <span className="text-base">{c.flag}</span>
                              {c.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <Link href="/about" onClick={() => setMobileOpen(false)} className={mobileNavLinkClass("/about")}>
                  About
                </Link>

                <div>
                  <button onClick={() => setMobileServicesOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-[#0b66d1]">
                    Services
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-2"
                      >
                        {services.map(s => (
                          <Link key={s.label} href={s.href} onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-[#0b66d1]">
                            {s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {[
                  { label: "Fleet",         href: "/fleet"   },
                  { label: "Corporate",     href: "/contact" },
                  { label: "Contact",       href: "/contact" },
                  { label: "Drive with Us", href: "/driver"  },
                ].map(item => (
                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                    className={mobileNavLinkClass(item.href)}>
                    {item.label}
                  </Link>
                ))}

                <div className="my-3 border-t border-gray-100" />

                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Download App</p>
                <div className="flex flex-col gap-2 px-1">
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 transition hover:border-[#0b66d1] hover:bg-blue-50"
                  >
                    <Apple className="h-5 w-5 text-gray-700" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">App Store</p>
                      <p className="text-xs text-gray-500">Download for iOS</p>
                    </div>
                  </a>
                  <a
                    href={PLAY_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 transition hover:border-[#0b66d1] hover:bg-blue-50"
                  >
                    <Smartphone className="h-5 w-5 text-gray-700" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Play Store</p>
                      <p className="text-xs text-gray-500">Download for Android</p>
                    </div>
                  </a>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link href="/#book" onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-[#0b66d1] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0952a8]">
                    Book a ride
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Country switch confirmation */}
      <AnimatePresence>
        {pendingCountry && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setPendingCountry(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900">Switch to {pendingCountry.name}?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Changing your region will switch pricing to <span className="font-semibold text-gray-700">{pendingCountry.currency}</span> and
                show vehicles and rates available in {pendingCountry.name}.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPendingCountry(null)}
                  className="flex-1 rounded-full bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setCountry(pendingCountry); setPendingCountry(null); }}
                  className="flex-1 rounded-full bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
                >
                  Yes, switch
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
