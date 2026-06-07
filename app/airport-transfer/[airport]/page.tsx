import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, Phone, Plane, Clock, Star } from "lucide-react";
import { airports } from "@/lib/data/seo-locations";
import type { Metadata } from "next";

interface Props { params: Promise<{ airport: string }> }

export function generateStaticParams() {
  return airports.map(a => ({ airport: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { airport } = await params;
  const ap = airports.find(a => a.slug === airport);
  if (!ap) return { title: "Not Found" };
  return {
    title: `${ap.code} Airport Transfer | Black Car Service ${ap.city}, ${ap.state} — BlackDrivo`,
    description: `Premium airport transfer to and from ${ap.name} (${ap.code}) in ${ap.city}, ${ap.state}. Fixed pricing, live flight tracking, professional chauffeurs 24/7. Book instantly.`,
    keywords: `${ap.code} airport transfer, ${ap.city} airport car service, ${ap.name} chauffeur, black car ${ap.code}, airport pickup ${ap.city}`,
    openGraph: {
      title: `BlackDrivo ${ap.code} Airport Transfer — ${ap.city}, ${ap.state}`,
      description: `Book a professional chauffeur at ${ap.name} (${ap.code}). Fixed pricing, flight tracking, meet & greet available.`,
      type: "website",
    },
  };
}

const getFaqs = (ap: { name: string; code: string; city: string; state: string }) => [
  { q: `How do I book a transfer at ${ap.name} (${ap.code})?`,                    a: `Use the BlackDrivo booking form, select Airport Transfer, enter your flight number and ${ap.code} as your airport, and confirm. You receive instant confirmation with your driver's name and contact.` },
  { q: `Does BlackDrivo track my flight at ${ap.code}?`,                          a: `Yes. Every ${ap.code} transfer includes live flight tracking. If your flight is delayed or diverted, your driver adjusts automatically — no calls needed.` },
  { q: `How long is the complimentary wait at ${ap.code}?`,                       a: `Domestic arrivals at ${ap.code} receive 60 minutes of complimentary wait time. International arrivals receive 90 minutes — sufficient for customs, immigration, and baggage claim.` },
  { q: `Where does my driver meet me at ${ap.code}?`,                             a: `Your driver positions at the arrivals curbside for your terminal at ${ap.code}. Meet & greet upgrades are available, placing your driver inside the arrivals hall with your name on a board.` },
  { q: `Is pricing fixed for ${ap.code} transfers?`,                              a: `Yes. All BlackDrivo fares from and to ${ap.code} are fixed at booking. No surge pricing regardless of traffic, weather, or demand on your travel day.` },
  { q: `What vehicle classes are available at ${ap.code}?`,                       a: `Executive Sedan, First Class Sedan, Luxury SUV, Executive SUV, and Sprinter Van are available at ${ap.code}. All accommodate standard luggage; note any oversized items at booking.` },
];

export default async function AirportPage({ params }: Props) {
  const { airport } = await params;
  const ap = airports.find(a => a.slug === airport);
  if (!ap) notFound();

  const faqs = getFaqs(ap);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${ap.code} Airport Transfer`,
    description: `Professional black car airport transfer service at ${ap.name} (${ap.code}) in ${ap.city}, ${ap.state}. Fixed pricing, flight tracking, meet & greet.`,
    provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
    areaServed: { "@type": "City", name: ap.city, containedInPlace: { "@type": "State", name: ap.state } },
    serviceType: "Airport Transfer",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",             item: "https://www.blackdrivo.com" },
      { "@type": "ListItem", position: 2, name: "Airport Transfer", item: "https://www.blackdrivo.com/airport-transfer" },
      { "@type": "ListItem", position: 3, name: ap.code,            item: `https://www.blackdrivo.com/airport-transfer/${ap.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
          <div className="absolute right-1/3 top-36 h-64 w-64 rounded-full bg-blue-50/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#0b66d1]">Home</Link>
            <span>›</span>
            <Link href="/airport-transfer" className="hover:text-[#0b66d1]">Airport Transfer</Link>
            <span>›</span>
            <span className="text-gray-900">{ap.code}</span>
          </nav>

          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            {ap.city}, {ap.state}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {ap.code} Airport Transfer<br className="hidden md:block" />
            <span className="text-[#0b66d1]"> {ap.city}, {ap.state}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-500 md:text-lg">
            Premium black car transfers to and from {ap.name} ({ap.code}). Professional chauffeurs,
            live flight tracking, and fixed pricing — available 24/7.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Book {ap.code} Transfer <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              <Phone className="h-4 w-4" /> Call 24/7
            </a>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-xl font-bold text-gray-900 md:text-2xl">
            What&apos;s included with every {ap.code} transfer
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Plane,       label: "Live flight tracking",             desc: "Automatic adjustment for delays, early arrivals, and gate changes."          },
              { icon: Clock,       label: "Complimentary wait time",          desc: `60 min domestic · 90 min international at ${ap.code}.`                      },
              { icon: Star,        label: "Professional chauffeur",           desc: "Background-checked, uniformed, and exclusively focused on you."              },
              { icon: CheckCircle, label: "Fixed pricing",                    desc: "Fare locked at booking — no surge, no meter."                               },
              { icon: CheckCircle, label: "Meet & greet available",           desc: `Driver inside ${ap.code} arrivals hall with your name on board.`            },
              { icon: CheckCircle, label: "Luggage assistance",               desc: "Your driver handles bags from carousel to vehicle."                          },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pickup guide */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">
            How your {ap.code} pickup works
          </h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Book online",               desc: `Enter your flight number and destination in the booking form. We handle everything from there.`                                             },
              { step: "2", title: "Real-time tracking",        desc: `Your driver monitors your {ap.code} flight status. If conditions change, the driver adjusts automatically.`.replace("{ap.code}", ap.code) },
              { step: "3", title: "Driver positioned at curb", desc: `Your uniformed chauffeur is at the ${ap.code} arrivals curbside with a name sign before you exit.`                                       },
              { step: "4", title: "Luggage & departure",       desc: "Your driver assists with bags and routes you to your destination on a fixed fare — no surprises."                                          },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b66d1] text-sm font-bold text-white">
                  {s.step}
                </div>
                <div className="flex-1 border-b border-gray-100 pb-4">
                  <p className="font-semibold text-gray-900">{s.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-xl font-bold text-gray-900 md:text-2xl">
            Frequently asked questions — {ap.code}
          </h2>
          <div className="space-y-3">
            {faqs.map(f => (
              <details key={f.q} className="group rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm open:border-[#0b66d1]/20">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-gray-900 marker:hidden">
                  {f.q}
                  <span className="text-lg leading-none text-gray-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-gray-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Book your {ap.code} transfer today
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fixed pricing · Flight tracking · Professional chauffeur · Available 24/7
          </p>
          <Link href="/booking"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            Book {ap.code} Transfer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
