"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, CheckCircle, Phone, Star, Clock, Shield } from "lucide-react";

type City = { slug: string; name: string; state: string; country: string; airport: string; pop: string };
type Faq = { q: string; a: string };

const servicesUs = [
  "Airport Transfers", "Executive Transportation", "Corporate Travel",
  "Hourly Chauffeur",  "Event Transportation",    "City-to-City Rides",
  "VIP Transportation","Wedding Transportation",
];

const servicesPk = [
  "Airport Transfers", "Executive Transportation", "Corporate Travel",
  "Hourly Driver",     "Event Transportation",    "City-to-City Rides",
  "VIP Transportation","Wedding Transportation",
];

export default function CityPageContent({ city, faqsUs, faqsPk }: { city: City; faqsUs: Faq[]; faqsPk: Faq[] }) {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  const faqs = isPk ? faqsPk : faqsUs;
  const word = isPk ? "driver" : "chauffeur";
  const Word = isPk ? "Driver" : "Chauffeur";
  const services = isPk ? servicesPk : servicesUs;
  const chauffeurServiceHref = isPk ? "/pk/chauffeur-service" : "/chauffeur-service";

  return (
    <div className="min-h-screen bg-white">
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
            <Link href={isPk ? "/pk" : "/"} className="hover:text-[#0b66d1]">Home</Link>
            <span>›</span>
            <Link href={chauffeurServiceHref} className="hover:text-[#0b66d1]">{Word} Service</Link>
            <span>›</span>
            <span className="text-gray-900">{city.name}</span>
          </nav>

          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            {city.state} · {city.airport}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {Word} Service in {city.name}, {city.state}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-500 md:text-lg">
            Premium black car and {word} service in {city.name}. Professional drivers, fixed pricing,
            and 24/7 availability — serving {city.airport} and all destinations across {city.state}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/#book"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Book in {city.name} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              <Phone className="h-4 w-4" /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-xl font-bold text-gray-900">Our services in {city.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(s => (
              <div key={s} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                <span className="text-sm font-medium text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-xl font-bold text-gray-900 md:text-2xl">
            Why choose BlackDrivo in {city.name}?
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Star,   title: "Top-rated service",   desc: `Consistently rated 4.9/5 by riders in ${city.name} and ${city.state}.`                 },
              { icon: Shield, title: `Vetted ${word}s`,      desc: `Every driver serving ${city.name} passes our background check and skills evaluation.`  },
              { icon: Clock,  title: "Always on time",       desc: `Real-time traffic routing and early dispatch ensure on-time arrivals in ${city.name}.` },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airport */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Airport service</p>
              <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                {city.airport} Airport Transfers
              </h2>
              <p className="mt-3 text-sm text-gray-500">
                BlackDrivo provides premium airport transfers to and from {city.airport} serving {city.name},
                {city.state}. Every booking includes live flight tracking and complimentary wait time.
              </p>
              <ul className="mt-4 space-y-2">
                {["Live flight tracking included", "60 min wait (domestic) · 90 min (international)", "Meet & greet or curbside", "Fixed pricing — no surge"].map(i => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Link href="/#book"
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                <div>
                  <p className="font-semibold text-gray-900">Book {city.airport} Transfer</p>
                  <p className="text-sm text-gray-500">Instant confirmation · Fixed price</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#0b66d1]" />
              </Link>
              <p className="mt-3 text-center text-xs text-gray-400">
                Or call <a href="tel:+18005550199" className="font-medium text-[#0b66d1]">+1 (800) 555-0199</a> for same-day bookings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-xl font-bold text-gray-900 md:text-2xl">
            Frequently asked questions — {city.name}
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
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-14 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
            Book your {word} in {city.name} today
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fixed pricing · Professional drivers · Available 24/7 in {city.name}, {city.state}
          </p>
          <Link href="/#book"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            Book in {city.name} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
