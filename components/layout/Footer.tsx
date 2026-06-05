import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "Airport Transfers", href: "/services#airport" },
    { label: "Hourly Chauffeur", href: "/services#hourly" },
    { label: "City-to-City Rides", href: "/services#city" },
    { label: "Corporate Travel", href: "/services#corporate" },
    { label: "Event Transportation", href: "/services#events" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Become a Driver", href: "/driver" },
  ],
  "Service Areas": [
    { label: "New Jersey", href: "/services#nj" },
    { label: "Long Island", href: "/services#li" },
    { label: "Connecticut", href: "/services#ct" },
    { label: "All Locations", href: "/services" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

const socialLinks = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Facebook, href: "#", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        {/* Top section */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_3fr]">
          {/* Brand */}
          <div>
            {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
          <Image
          src="/logo wb.png"
          alt="BlackDrivo"
          width={140}
          height={40}
          className="object-contain transition-all duration-300"/>
          </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              Premium chauffeur service across New Jersey, and the surrounding tri-state area.
              Available 24/7.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-white/55">
              <a href="tel:+18005550199" className="flex items-center gap-2.5 hover:text-white transition">
                <Phone className="h-4 w-4 text-[#0b66d1]" />
                +1 (800) 555-0199
              </a>
              <a href="mailto:support@blackdrivo.com" className="flex items-center gap-2.5 hover:text-white transition">
                <Mail className="h-4 w-4 text-[#0b66d1]" />
                support@blackdrivo.com
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
                <span>NY 10001 — Serving all of NY, NJ & surrounding areas</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
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
                        href={link.href}
                        className="text-sm text-white/60 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#0b66d1]/12 p-6 md:flex md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">Ready to ride in premium comfort?</p>
            <p className="text-sm text-white/55">Book your chauffeur in under 2 minutes.</p>
          </div>
          <div className="mt-4 flex gap-3 md:mt-0">
            <Link
              href="/booking"
              className="rounded-full bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              Book a ride
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} BlackDrivo Inc. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/accessibility" className="hover:text-white transition">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
