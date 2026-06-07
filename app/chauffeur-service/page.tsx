import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, MapPin, Phone } from "lucide-react";
import { cities } from "@/lib/data/seo-locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chauffeur Service | Premium Black Car Service Nationwide",
  description: "Professional chauffeur service in New York, New Jersey, Los Angeles, Chicago, Miami and 40+ US cities. Fixed pricing, vetted drivers, 24/7 available. Book instantly.",
  keywords: "chauffeur service, black car service, private driver, luxury car service, executive chauffeur, professional driver",
  openGraph: {
    title: "BlackDrivo Chauffeur Service — Nationwide Premium Ground Transportation",
    description: "Book a professional chauffeur in 40+ US cities. Fixed pricing, vetted drivers, flight tracking included.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Chauffeur Service",
  provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
  serviceType: "Chauffeur Service",
  areaServed: { "@type": "Country", name: "United States" },
  description: "Professional black car and chauffeur service in 40+ US cities. Fixed pricing, vetted drivers, 24/7 availability.",
};

const features = [
  "Licensed & insured professional chauffeurs",
  "Background-checked and regularly evaluated",
  "Clean, well-maintained premium vehicles",
  "Fixed pricing — no metered surprises",
  "Flight tracking for airport pickups",
  "Meet & greet service available",
  "24/7 customer support",
  "Corporate billing & monthly invoices",
];

export default function ChauffeurServicePage() {
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Professional Chauffeur Service</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Premium Chauffeur Service<br className="hidden md:block" /> Across the United States
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-500 md:text-lg">
            Professional, uniformed chauffeurs. Fixed pricing. Flight-tracked airport pickups.
            Available in 40+ cities — 24 hours a day, 7 days a week.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Book a Chauffeur <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              <Phone className="h-4 w-4" /> +1 (800) 555-0199
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">What sets our chauffeur service apart</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(f => (
              <div key={f} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
                <p className="text-sm text-gray-700">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City grid */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Service Areas</p>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Chauffeur service in your city</h2>
            <p className="mt-3 text-base text-gray-500">Select your city for local pricing, availability, and route-specific information.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cities.map(city => (
              <Link key={city.slug} href={`/chauffeur-service/${city.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md">
                <MapPin className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{city.name}</p>
                  <p className="text-xs text-gray-400">{city.state} · {city.airport}</p>
                </div>
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-300 transition group-hover:text-[#0b66d1]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900">Ready to book your chauffeur?</h2>
          <p className="mt-3 text-base text-gray-500">Fixed pricing · Professional drivers · Flight tracking included</p>
          <Link href="/booking"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
