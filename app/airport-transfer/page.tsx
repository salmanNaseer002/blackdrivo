import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Plane, Phone, Clock, Shield } from "lucide-react";
import { airports } from "@/lib/data/seo-locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Airport Transfer Service | Premium Black Car Airport Rides",
  description: "Professional airport transfer service at JFK, LGA, EWR, LAX, ORD and 30+ US airports. Flight tracking included, fixed pricing, meet & greet available. Book instantly.",
  keywords: "airport transfer, airport car service, black car airport, chauffeur airport pickup, JFK transfer, EWR transfer, LAX transfer",
  openGraph: {
    title: "BlackDrivo Airport Transfer — Flight-Tracked Premium Ground Transportation",
    description: "Book airport transfers at 30+ US airports. Fixed pricing, flight tracking, 60–90 min wait included. Professional chauffeurs 24/7.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Airport Transfer Service",
  provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
  serviceType: "Airport Transfer",
  areaServed: { "@type": "Country", name: "United States" },
  description: "Flight-tracked airport transfers at 30+ US airports. Fixed pricing, professional chauffeurs, meet & greet available.",
};

const features = [
  { icon: Plane,       title: "Live Flight Tracking",   desc: "We monitor your flight in real time. Your driver adjusts automatically if you land early, late, or at a different gate."    },
  { icon: Clock,       title: "Complimentary Wait Time", desc: "60 min for domestic arrivals. 90 min for international — enough time to clear customs and collect luggage."                 },
  { icon: Shield,      title: "Fixed Pricing",           desc: "Your fare is locked at booking. No surge charges regardless of traffic, weather, or demand on your travel day."            },
  { icon: CheckCircle, title: "Meet & Greet",            desc: "Your driver greets you by name inside arrivals or curbside. Your choice — both options available at every airport."        },
];

export default function AirportTransferPage() {
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Airport Transfer Service</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Premium Airport Transfers<br className="hidden md:block" /> at Every Major US Airport
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-500 md:text-lg">
            Flight-tracked pickups, fixed pricing, and professional chauffeurs at JFK, LGA, EWR,
            LAX, ORD and 30+ airports nationwide — available 24/7.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Book Airport Transfer <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              <Phone className="h-4 w-4" /> 24/7 Support
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Airport grid */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto w-full">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Airports We Serve</p>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Select your airport</h2>
            <p className="mt-3 text-base text-gray-500">
              Click your departure or arrival airport for pickup guides, local pricing, and booking.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {airports.map(ap => (
              <Link key={ap.slug} href={`/airport-transfer/${ap.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md">
                <div className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-[#0b66d1]">
                  {ap.code}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{ap.city}, {ap.state}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ap.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-gray-900">Book your airport transfer now</h2>
          <p className="mt-3 text-sm text-gray-500">Flight tracking · Fixed pricing · Meet & greet available</p>
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
