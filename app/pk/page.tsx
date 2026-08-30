import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSection from "@/components/shared/FAQSection";
import Link from "next/link";
import { ArrowRight, CheckCircle, MapPin, ShieldCheck, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlackDrivo Pakistan — Premium Chauffeur Service in Lahore, Karachi & Islamabad",
  description:
    "BlackDrivo is now available across Pakistan — premium chauffeur and black car service in Lahore, Karachi, and Islamabad. Fixed pricing, professional drivers, airport transfers, and hourly rentals.",
  keywords: [
    "chauffeur service Pakistan",
    "black car service Lahore",
    "premium car service Karachi",
    "airport transfer Islamabad",
    "luxury car rental Pakistan",
    "hourly chauffeur Lahore",
    "blackdrivo Pakistan",
  ],
  alternates: {
    canonical: "/pk",
    languages: { "en-US": "/", "en-PK": "/pk" },
  },
  openGraph: {
    type: "website",
    url: "https://www.blackdrivo.com/pk",
    title: "BlackDrivo Pakistan — Premium Chauffeur Service",
    description: "Premium chauffeur and black car service across Lahore, Karachi, and Islamabad. Fixed pricing, professional drivers.",
    siteName: "BlackDrivo",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BlackDrivo",
  url: "https://www.blackdrivo.com/pk",
  areaServed: [
    { "@type": "City", name: "Lahore" },
    { "@type": "City", name: "Karachi" },
    { "@type": "City", name: "Islamabad" },
  ],
  description: "Premium chauffeur and black car service across Pakistan — Lahore, Karachi, and Islamabad.",
};

const cities = [
  { name: "Lahore", desc: "Airport transfers, city rides, and hourly chauffeur service across Lahore." },
  { name: "Karachi", desc: "Reliable premium rides and airport pickups throughout Karachi." },
  { name: "Islamabad", desc: "Professional chauffeur service for business and airport travel in Islamabad." },
];

const features = [
  { icon: ShieldCheck, title: "Fixed Pricing", desc: "Your fare is locked in at booking — no surge charges, no hidden fees." },
  { icon: Clock,       title: "24/7 Availability", desc: "Book a ride anytime, day or night, across all three cities." },
  { icon: CheckCircle, title: "Vetted Chauffeurs", desc: "Every driver is licensed, verified, and professionally trained." },
];

const faqItems = [
  { q: "Which cities in Pakistan does BlackDrivo serve?", a: "BlackDrivo currently operates in Lahore, Karachi, and Islamabad, with plans to expand to more cities across Pakistan." },
  { q: "Is pricing fixed for rides in Pakistan?", a: "Yes — every ride has a fixed, upfront fare set at the time of booking, with no surge pricing regardless of traffic or demand." },
  { q: "Does BlackDrivo offer airport transfers in Pakistan?", a: "Yes, BlackDrivo provides airport transfer service in Lahore, Karachi, and Islamabad with professional chauffeurs and reliable pickup times." },
  { q: "Can I book an hourly chauffeur in Pakistan?", a: "Yes — hourly and per-day rental packages are available for multi-stop trips, business meetings, and events." },
  { q: "How do I book a ride with BlackDrivo in Pakistan?", a: "You can book instantly through the BlackDrivo website or mobile app, selecting Pakistan as your region." },
];

export default function PakistanPage() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-blue-50/50 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Now in Pakistan</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Premium Chauffeur Service<br className="hidden md:block" /> in Lahore, Karachi &amp; Islamabad
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-500 md:text-lg">
            Fixed pricing, professional chauffeurs, and reliable airport transfers — book a premium ride anywhere across Pakistan.
          </p>
          <Link href="/#book"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <f.icon className="mx-auto h-8 w-8 text-[#0b66d1]" />
              <h3 className="mt-4 text-base font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cities */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">Available Across Pakistan</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cities.map((city) => (
              <div key={city.name} className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0b66d1]" />
                  <h3 className="text-base font-semibold text-gray-900">{city.name}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-500">{city.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection items={faqItems} subtitle="Common questions about BlackDrivo's service in Pakistan." />

      {/* CTA */}
      <section className="border-t border-gray-100 px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900">Ready to book your ride in Pakistan?</h2>
          <p className="mt-3 text-base text-gray-500">Fixed pricing · Professional chauffeurs · Available 24/7</p>
          <Link href="/#book"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
