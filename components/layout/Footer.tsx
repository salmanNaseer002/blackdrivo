"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Linkedin, Facebook, Apple } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Airport Transfer", href: "/services/airport" },
    { label: "Hourly Chauffeur", href: "/services/hourly" },
    { label: "City-to-City Rides", href: "/services/city" },
    { label: "Corporate Travel", href: "/services/corporate" },
    { label: "Event Transportation", href: "/services/events" },
  ],
  Company: [
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Become a Partner", href: "/partner" },
  ],

  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
  ],

   "Mobile Apps": [
  { label: "Download on iOS", href: "#" },
  { label: "Get it on Android", href: "#" },
  { label: "Driver App", href: "/partner" },
],
};

const socialLinks = [

  {
    Icon: Linkedin,
    href: "https://linkedin.com/company/BlackDrivo",
    label: "LinkedIn",
  },
  {
    Icon: Facebook,
    href: "https://www.facebook.com/BlackDrivo",
    label: "Facebook",
  },
];
export default function Footer() {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  const withRegion = (href: string) => {
    if (!isPk || href.startsWith("http") || href === "#") return href;
    if (href === "/") return "/pk";
    return `/pk${href}`;
  };

  return (
    <footer className="relative z-10 bg-[#0a0f1a] text-white">
      <div className="w-full px-6 py-16 lg:px-12 xl:px-16">
        {/* Top section */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_3fr]">
          {/* Brand */}
          <div>
            {/* Logo */}
          <Link href={withRegion("/")} className="flex items-center shrink-0">
          <Image
          src="/logo wb.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              {isPk
                ? "Premium driver service across Lahore, Karachi, and Islamabad. Available 24/7."
                : "Premium chauffeur service across New Jersey, and the surrounding tri-state area. Available 24/7."}
            </p>
            <div className="mt-6 flex items-center gap-3">
  {socialLinks.map(({ Icon, href, label }) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/50 transition hover:border-[#0b66d1] hover:bg-[#0b66d1]/15 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </a>
  ))}
</div>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
                  {category}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={withRegion(link.href)}
                        className="text-sm text-white/60 transition hover:text-white"
                      >
                        {isPk && link.label === "Hourly Chauffeur" ? "Hourly Driver" : link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* App Download Strip — flat */}
<div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/8 pt-10 md:flex-row">
  <div>
    <p className="text-lg font-semibold text-white">Ride smarter with the BlackDrivo app</p>
    <p className="mt-1 text-sm text-white/55">Book, track, and manage rides from your phone.</p>
  </div>
  <div className="flex items-center gap-6">
    {/* App Store */}
    <a href="#" className="flex items-center gap-2.5 text-white/70 transition hover:text-white">
      <Apple className="h-6 w-6" />
      <div>
        <p className="text-[11px] leading-tight text-white/45">Download on the</p>
        <p className="text-sm font-semibold leading-tight">App Store</p>
      </div>
    </a>
    {/* Google Play */}
    <a href="#" className="flex items-center gap-2.5 text-white/70 transition hover:text-white">
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.26-2.75-2.75-10.84 9.81zM.54 1.18C.2 1.51 0 2.06 0 2.78v18.44c0 .72.2 1.27.54 1.6l.08.08 10.33-10.33v-.24L.62 1.1l-.08.08zM20.4 10.66l-2.94-1.7-3.07 3.07 3.07 3.07 2.96-1.71c.84-.49.84-1.24-.02-1.73zM3.18.24L15.78 7.5l-2.75 2.75L2.19.44c.3-.37.68-.37.99-.2z"/>
      </svg>
      <div>
        <p className="text-[11px] leading-tight text-white/45">Get it on</p>
        <p className="text-sm font-semibold leading-tight">Google Play</p>
      </div>
    </a>
  </div>
</div>



        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} BlackDrivo Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href={withRegion("/privacy-policy")} className="hover:text-white transition">Privacy Policy</Link>
            <Link href={withRegion("/terms-of-service")} className="hover:text-white transition">Terms of Service</Link>
            <Link href={withRegion("/accessibility")} className="hover:text-white transition">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
