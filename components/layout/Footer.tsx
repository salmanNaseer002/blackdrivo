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


 

  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
  ],

   "Mobile Apps": [
  { label: "Download on iOS", href: "#" },
  { label: "Get it on Android", href: "#" },
  { label: "Driver App", href: "#" },
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
  return (
    <footer className="bg-[#0a0f1a] text-white">
      <div className="w-full px-6 py-16 lg:px-12 xl:px-16">
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
                Hello@blackdrivo.com
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
                <span>NJ & surrounding areas</span>
              </div>
            </div>
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

        {/* App Download Strip */}
<div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/4 p-8 md:flex-row md:justify-between">
  <div>
    <p className="text-lg font-semibold text-white">Ride smarter with the BlackDrivo app</p>
    <p className="mt-1 text-sm text-white/55">Book, track, and manage rides from your phone.</p>
  </div>
  <div className="flex gap-3">
    {/* App Store */}
    <a href="#" className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/8 px-5 py-3 transition hover:bg-white/14">
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      <div>
        <p className="text-xs text-white/50">Download on the</p>
        <p className="text-sm font-semibold text-white">App Store</p>
      </div>
    </a>
    {/* Google Play */}
    <a href="#" className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/8 px-5 py-3 transition hover:bg-white/14">
      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.26-2.75-2.75-10.84 9.81zM.54 1.18C.2 1.51 0 2.06 0 2.78v18.44c0 .72.2 1.27.54 1.6l.08.08 10.33-10.33v-.24L.62 1.1l-.08.08zM20.4 10.66l-2.94-1.7-3.07 3.07 3.07 3.07 2.96-1.71c.84-.49.84-1.24-.02-1.73zM3.18.24L15.78 7.5l-2.75 2.75L2.19.44c.3-.37.68-.37.99-.2z"/>
      </svg>
      <div>
        <p className="text-xs text-white/50">Get it on</p>
        <p className="text-sm font-semibold text-white">Google Play</p>
      </div>
    </a>
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
