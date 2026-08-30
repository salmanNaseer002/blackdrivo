"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Apple, User, Phone } from "lucide-react";
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
  { label: "Overview",             href: "/services",           desc: "See everything we offer"     },
  { label: "Airport Transfers",    href: "/services/airport",   desc: "Flight-tracked pickups"      },
  { label: "Hourly Chauffeur",     href: "/services/hourly",    desc: "From 2 to 24 hours"          },
  { label: "City-to-City Rides",   href: "/services/city",      desc: "Long distance in comfort"    },
  { label: "Corporate Travel",     href: "/services/corporate", desc: "Business travel solutions"   },
  { label: "Weddings",             href: "/services/weddings",  desc: "Your perfect day, arrived"   },
  { label: "Special Events",       href: "/services/events",    desc: "Galas, fundraisers & more"   },
];

const business = [
  { label: "Overview",               href: "/business",                  desc: "Ground transport for your company" },
  { label: "Corporate",               href: "/business/corporate",        desc: "Centralized billing & travel policy" },
  { label: "Travel Partner",          href: "/business/travel-partner",   desc: "For agencies & travel managers"     },
  { label: "Business Partnerships",   href: "/business/partnerships",     desc: "Hotels, venues & referral partners" },
];

export default function Navbar() {
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [countryOpen,  setCountryOpen]  = useState(false);
  const [countryOpenMobile, setCountryOpenMobile] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileBusinessOpen, setMobileBusinessOpen] = useState(false);
  const [showFloatingBook, setShowFloatingBook] = useState(false);
  const [pendingCountry, setPendingCountry] = useState<SiteCountry | null>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const countryRef  = useRef<HTMLDivElement>(null);
  const countryRefMobile = useRef<HTMLDivElement>(null);
  const pathname    = usePathname();
  const { user, profile, loading, isDriver, initials, displayName } = useUser();
  const { country, countries, setCountry } = useSiteCountry();

  // Keeps navigation inside the /pk region once a visitor is on it — a plain
  // "/services" link from /pk would otherwise drop them back onto the
  // default (US) site.
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  const withRegion = (href: string) => {
    if (!isPk) return href;
    if (href === "/") return "/pk";
    if (href.startsWith("/#")) return `/pk${href.slice(1)}`;
    return `/pk${href}`;
  };

  // /pk/services, /pk/business, etc. render the exact same content as their
  // un-prefixed page (middleware rewrite) — strip the prefix before checking
  // which page this effectively is, so the hero-photo pages get the same
  // transparent navbar under /pk too instead of always falling back to solid.
  const effectivePath = pathname === "/pk" ? "/" : pathname.startsWith("/pk/") ? pathname.slice(3) : pathname;
  const isHomePage = pathname === "/";
  // Pages that open with a fixed hero photo (Home, Services, Business — overview + slugs)
  // get the same transparent-over-hero-then-solid-on-scroll navbar as the homepage.
  const hasHeroBackground =
    effectivePath === "/" ||
    effectivePath === "/services" ||
    effectivePath.startsWith("/services/") ||
    effectivePath === "/business" ||
    effectivePath.startsWith("/business/") ||
    effectivePath === "/partner" ||
    effectivePath === "/contact";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
      if (!businessRef.current?.contains(e.target as Node)) setBusinessOpen(false);
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

  const solidBg = isScrolled || !hasHeroBackground;

  // Returns true when the current path matches this nav item — compares
  // against effectivePath so /pk/services still highlights "Services".
  const isActive = (href: string) =>
    href === "/" ? effectivePath === "/" : effectivePath.startsWith(href.split("#")[0]);

  const navLinkClass = (href: string) => {
    const active = isActive(href);
    return `border-b-2 px-3.5 py-2 text-sm transition ${
      solidBg
        ? active
          ? "border-[#0b66d1] font-semibold text-[#0b66d1]"
          : "border-transparent font-medium text-gray-700 hover:border-[#0b66d1] hover:text-[#0b66d1]"
        : active
          ? "border-white font-semibold text-white"
          : "border-transparent font-medium text-white/90 hover:border-white hover:text-white"
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
            <Link href={withRegion("/")} className="flex items-center shrink-0">
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
                      className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-lg"
                    >
                      {services.map(s => (
                        <Link key={s.label} href={withRegion(s.href)} onClick={() => setServicesOpen(false)}
                          className="group relative block py-2 pl-5 pr-4 transition">
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] origin-center scale-y-0 rounded-full bg-[#0b66d1] transition-transform duration-150 group-hover:scale-y-100" />
                          <p className="text-sm text-gray-800 transition group-hover:font-semibold group-hover:text-[#0b66d1]">{isPk && s.label === "Hourly Chauffeur" ? "Hourly Driver" : s.label}</p>
                          <p className="text-xs text-gray-500">{s.desc}</p>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={businessRef}>
                <button onClick={() => setBusinessOpen(!businessOpen)} className={`flex items-center gap-1.5 ${navLinkClass("/business")}`}>
                  Business
                  <ChevronDown className={`h-4 w-4 transition-transform ${businessOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {businessOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-gray-100 bg-white py-2 shadow-lg"
                    >
                      {business.map(b => (
                        <Link key={b.label} href={withRegion(b.href)} onClick={() => setBusinessOpen(false)}
                          className="group relative block py-2 pl-5 pr-4 transition">
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] origin-center scale-y-0 rounded-full bg-[#0b66d1] transition-transform duration-150 group-hover:scale-y-100" />
                          <p className="text-sm text-gray-800 transition group-hover:font-semibold group-hover:text-[#0b66d1]">{b.label}</p>
                          <p className="text-xs text-gray-500">{b.desc}</p>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href={withRegion("/contact")} className={navLinkClass("/contact")}>Contact</Link>
              <Link href={withRegion("/partner")}   className={navLinkClass("/partner")}>Become a Partner</Link>

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
              <Link href={withRegion("/#book")} className="rounded-full bg-[#0b66d1] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0952a8] active:scale-95">
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
                href={withRegion("/#book")}
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
                  <Link href={withRegion("/")} onClick={() => setMobileOpen(false)} className="flex items-center">
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
                          <Link key={s.label} href={withRegion(s.href)} onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-[#0b66d1]">
                            {isPk && s.label === "Hourly Chauffeur" ? "Hourly Driver" : s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <button onClick={() => setMobileBusinessOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-[#0b66d1]">
                    Business
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${mobileBusinessOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {mobileBusinessOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-2"
                      >
                        {business.map(b => (
                          <Link key={b.label} href={withRegion(b.href)} onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-[#0b66d1]">
                            {b.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {[
                  { label: "Contact",       href: "/contact" },
                  { label: "Become a Partner", href: "/partner"  },
                ].map(item => (
                  <Link key={item.label} href={withRegion(item.href)} onClick={() => setMobileOpen(false)}
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
                    <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.26-2.75-2.75-10.84 9.81zM.54 1.18C.2 1.51 0 2.06 0 2.78v18.44c0 .72.2 1.27.54 1.6l.08.08 10.33-10.33v-.24L.62 1.1l-.08.08zM20.4 10.66l-2.94-1.7-3.07 3.07 3.07 3.07 2.96-1.71c.84-.49.84-1.24-.02-1.73zM3.18.24L15.78 7.5l-2.75 2.75L2.19.44c.3-.37.68-.37.99-.2z"/>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Play Store</p>
                      <p className="text-xs text-gray-500">Download for Android</p>
                    </div>
                  </a>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link href={withRegion("/#book")} onClick={() => setMobileOpen(false)}
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
