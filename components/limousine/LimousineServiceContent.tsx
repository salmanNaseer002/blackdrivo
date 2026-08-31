"use client";

import type { ComponentType } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, Phone, Star, Users, Briefcase,
  Clock, Shield, Award, Globe, Headphones, CreditCard,
  ChevronDown, Plane, Heart, Music, MessageCircle, Building2,
} from "lucide-react";
import { regionizeForPk } from "@/lib/regionizeText";

type IconType = ComponentType<{ className?: string }>;

// Icon-bearing data lives here (not passed as props from the Server Component
// page, since React component references can't cross that boundary).
const whyChoose: { icon: IconType; title: string; desc: string }[] = [
  { icon: Award, title: "Professional Chauffeurs", desc: "Uniformed, background-checked, and trained to the highest luxury service standards." },
  { icon: Plane, title: "Real-Time Flight Tracking", desc: "We monitor every flight. Delays never leave our clients stranded — ever." },
  { icon: Clock, title: "Guaranteed On-Time", desc: "Punctuality is not a promise — it is our operational standard on every single trip." },
  { icon: CreditCard, title: "Fixed Transparent Pricing", desc: "Your price is locked at booking. No surge charges, no surprises, guaranteed." },
  { icon: Headphones, title: "24/7 Customer Support", desc: "Round-the-clock human support via phone, live chat, and WhatsApp — always available." },
  { icon: Globe, title: "Worldwide Coverage", desc: "Local expertise in 40+ US cities and international destinations worldwide." },
  { icon: Building2, title: "Corporate Billing", desc: "Monthly invoicing, dedicated account management, and priority booking for businesses." },
  { icon: Shield, title: "Fully Licensed & Insured", desc: "Every vehicle and chauffeur is fully licensed, insured, and compliant in every state." },
];

const occasions: { icon: IconType; title: string; desc: string }[] = [
  { icon: Plane, title: "Airport Transfers", desc: "Flight-tracked luxury pickups from every major US airport. Professional meet & greet available at arrivals." },
  { icon: Building2, title: "Corporate Travel", desc: "Executive ground transportation for business leaders, roadshows, investor meetings, and client events." },
  { icon: Heart, title: "Weddings", desc: "Elegant bridal transportation that creates memories lasting a lifetime — for the entire wedding party." },
  { icon: Star, title: "Prom & Special Events", desc: "Unforgettable luxury experiences for life's milestone celebrations, proms, and sweet sixteens." },
  { icon: Shield, title: "VIP Transportation", desc: "Discreet, premium transport for executives, celebrities, dignitaries, and high-profile clients." },
  { icon: Music, title: "Night Out in the City", desc: "Luxury city experiences without the stress of driving, parking, or planning — just pure enjoyment." },
];

export default function LimousineServiceContent({
  vehicles,
  galleryImages,
  testimonials,
  steps,
  stats,
  faqItems,
}: {
  vehicles: {
    name: string; tagline: string; image: string; passengers: string; bags: string; features: string[];
  }[];
  galleryImages: { src: string; alt: string; tall: boolean }[];
  testimonials: { name: string; role: string; rating: number; text: string; initials: string }[];
  steps: { num: string; title: string; desc: string }[];
  stats: { number: string; label: string }[];
  faqItems: { q: string; a: string }[];
}) {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  const r = (text: string) => regionizeForPk(text, isPk);
  const bookHref = isPk ? "/pk/#book" : "/#book";
  const phoneDisplay = isPk ? "0305 2222744" : "+1 (800) 555-0199";
  const phoneHref = isPk ? "tel:+923052222744" : "tel:+18005550199";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Background video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster="/STRETCH LIMOUSINE.jpg"
          >
            <source src="/herobg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-32 md:px-8 md:py-44">
          <div className="max-w-3xl">
            {/* eyebrow */}
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              <span className="h-px w-8 bg-[#C5A028]" />
              Premium Limousine Service
            </p>

            {/* H1 */}
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Luxury Limousine<br className="hidden sm:block" />
              <span className="text-[#C5A028]">Service</span> Worldwide
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Travel in comfort, elegance, and style with BlackDrivo's premium limousine fleet. Perfect
              for airport transfers, weddings, corporate events, and VIP transportation.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={bookHref}
                className="inline-flex items-center justify-center gap-2 bg-[#C5A028] px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#A8871E]"
              >
                Book Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:border-[#C5A028] hover:text-[#C5A028]"
              >
                Get Instant Quote
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { icon: Award,     label: r("Pro Chauffeurs")  },
                  { icon: Plane,     label: "Flight Tracking" },
                  { icon: CreditCard, label: "Fixed Pricing"  },
                  { icon: Headphones, label: "24/7 Support"   },
                ] as const
              ).map(badge => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 border border-white/15 bg-black/30 px-4 py-3 backdrop-blur-sm"
                >
                  <badge.icon className="h-4 w-4 shrink-0 text-[#C5A028]" />
                  <span className="text-xs font-semibold text-white">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── VEHICLE SHOWCASE ──────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">Our Fleet</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Premium Limousine Fleet
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              {r("Every vehicle is meticulously maintained, fully equipped, and driven by a professional uniformed chauffeur trained to the highest service standards.")}
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          {/* Vehicle cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {vehicles.map(v => (
              <div
                key={v.name}
                className="group overflow-hidden border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Tagline badge */}
                  <div className="absolute left-4 top-4">
                    <span className="bg-[#C5A028] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-black">
                      {v.tagline}
                    </span>
                  </div>

                  {/* Capacity chips */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Users className="h-3.5 w-3.5 text-[#C5A028]" />
                      {v.passengers}
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Briefcase className="h-3.5 w-3.5 text-[#C5A028]" />
                      {v.bags}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="text-xl font-extrabold text-gray-900">{v.name}</h3>
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {v.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#C5A028]" />
                        <span className="text-xs text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex gap-3">
                    <Link
                      href={bookHref}
                      className="flex flex-1 items-center justify-center gap-2 bg-[#0b66d1] py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
                    >
                      Book This Vehicle <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/fleet"
                      className="inline-flex items-center justify-center border border-gray-200 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-600 transition hover:border-[#C5A028] hover:text-[#C5A028]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See full fleet CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 border border-gray-200 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-700 transition hover:border-[#C5A028] hover:text-[#C5A028]"
            >
              View Full Fleet <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE BLACKDRIVO ─────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-[#FAFAFA] px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Why BlackDrivo
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              The BlackDrivo Difference
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              Eight reasons why discerning travelers, executives, and luxury clients choose BlackDrivo
              over every other limousine service.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map(item => (
              <div
                key={item.title}
                className="border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:border-[#C5A028]/40 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-[#FBF6E9]">
                  <item.icon className="h-5 w-5 text-[#C5A028]" />
                </div>
                <h3 className="font-bold text-gray-900">{r(item.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{r(item.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OCCASIONS ────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Every Occasion
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Limousine Service for Every Event
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              From the world's busiest airports to your most intimate celebrations — BlackDrivo
              delivers luxury transportation precisely when and where you need it.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map(o => (
              <div
                key={o.title}
                className="group relative overflow-hidden bg-gray-900 p-8 transition duration-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-gray-900/90" />
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#C5A028]/5 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#C5A028]/3 blur-xl" />

                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#C5A028]/30 bg-[#C5A028]/10">
                    <o.icon className="h-5 w-5 text-[#C5A028]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{o.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-white/55">{r(o.desc)}</p>
                  <Link
                    href={bookHref}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C5A028] transition group-hover:gap-3"
                  >
                    Book Now <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Fleet Gallery
            </p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              Experience the Difference
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
              Explore our fleet inside and out — exterior elegance and interior luxury in every detail.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          {/* Masonry-style grid */}
          <div className="grid auto-rows-[180px] grid-cols-2 gap-2 md:grid-cols-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${img.tall ? "row-span-2" : "row-span-1"}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-700 hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/25 transition duration-300 hover:bg-black/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Client Reviews
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              4.9 stars from 847+ verified reviews. Trusted by executives, celebrities, and discerning
              travelers worldwide.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="flex flex-col border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C5A028] text-[#C5A028]" />
                  ))}
                </div>

                {/* Review text */}
                <blockquote className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                  &ldquo;{r(t.text)}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-900 text-sm font-extrabold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{t.name}</p>
                    <p className="text-xs text-[#C5A028]">{r(t.role)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Simple Process
            </p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
              Booking your luxury limousine with BlackDrivo takes less than two minutes.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-[#C5A028]/20 lg:block" />
                )}

                {/* Step number */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#C5A028]/30 bg-[#C5A028]/10 text-2xl font-extrabold text-[#C5A028]">
                  {s.num}
                </div>
                <h3 className="mt-5 font-extrabold text-white">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-white/50">{r(s.desc)}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href={bookHref}
              className="inline-flex items-center gap-2 bg-[#C5A028] px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#A8871E]"
            >
              Start Your Booking <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-4 py-20 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-5">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold text-[#C5A028] md:text-5xl">
                  {isPk && s.label === "Cities Covered" ? "3" : s.number}
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/40">
                  {r(s.label)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">FAQ</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              Everything you need to know about BlackDrivo limousine service — answered honestly.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="space-y-2">
            {faqItems.map(item => (
              <details
                key={item.q}
                className="group border border-gray-100 bg-white open:border-[#C5A028]/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50">
                  <span>{r(item.q)}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#C5A028] transition duration-300 group-open:rotate-180" />
                </summary>
                <div className="border-t border-gray-100 px-6 py-5 text-sm leading-7 text-gray-600">
                  {r(item.a)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-[#FAFAFA] px-4 py-24 md:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-sm leading-8 text-gray-600">

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Luxury Limousine Service You Can Trust
            </h2>
            <p>
              {r("BlackDrivo is America's premier luxury limousine service, providing world-class transportation for executives, celebrities, wedding parties, and discerning travelers who demand excellence in every mile. Our fleet of meticulously maintained limousines, combined with our team of professionally trained, uniformed chauffeurs, sets the standard for luxury ground transportation across the United States and beyond.")}
            </p>
            <p className="mt-4">
              {r("When you choose BlackDrivo's limousine service, you are choosing far more than a vehicle. You are choosing a complete luxury travel experience — from the moment you make your reservation to the moment your chauffeur drops you at your destination. Every interaction, every vehicle, and every chauffeur reflects our unwavering commitment to five-star quality, absolute punctuality, and genuine hospitality.")}
            </p>
            <p className="mt-4">
              Our limousine service is available 24 hours a day, seven days a week, 365 days a year.
              Whether you need an airport pickup at 3 AM, a wedding limousine on a Saturday afternoon,
              or an executive transfer during peak rush hour, BlackDrivo is always ready. Our operations
              team monitors every booking in real time, ensuring nothing falls through the cracks and
              every client experience is flawless.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Airport Limousine Service: Stress-Free Travel Starts Here
            </h2>
            <p>
              Airport transfers represent one of the most stressful travel scenarios for any traveler —
              missed flights, surge-priced rideshares, unreliable taxis, and the chaos of major airports
              can turn any journey into an ordeal. BlackDrivo's airport limousine service eliminates that
              stress entirely, replacing it with calm, professional, and punctual luxury transportation.
            </p>
            <p className="mt-4">
              {r("Our airport limousine service is built around three core principles: real-time flight tracking, guaranteed fixed pricing, and professional meet-and-greet service. When your flight lands — whether on time, early, or delayed — your chauffeur is already adjusted and waiting. For domestic arrivals, we provide 60 minutes of complimentary wait time. For international arrivals, we extend that to 90 minutes to ensure you have ample time to clear customs and collect your luggage without any pressure whatsoever.")}
            </p>
            <p className="mt-4">
              {r("We serve 30+ major US airports including JFK, LaGuardia, Newark, LAX, O'Hare, Miami International, Dallas/Fort Worth, Las Vegas Harry Reid, Boston Logan, and many more. Whether you are arriving for a business meeting or departing for a long-awaited vacation, BlackDrivo's airport limousine ensures your journey begins and ends in first-class comfort.")}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Wedding Limousine Service: Make Your Day Unforgettable
            </h2>
            <p>
              Your wedding day is one of the most important days of your life, and the details matter
              enormously. BlackDrivo's wedding limousine service is designed to ensure that your
              transportation is not just reliable — it is genuinely extraordinary. From the moment the
              bridal party is picked up to the final farewell as the newlyweds depart the reception,
              every element of your wedding transportation is handled with grace, professionalism, and
              impeccable attention to detail.
            </p>
            <p className="mt-4">
              {r("Our wedding fleet includes our classic stretch limousines, capable of accommodating up to 10 passengers for the bridal party, as well as our luxury Mercedes Sprinter for larger groups. All vehicles can be tastefully decorated with ribbons, flowers, or custom signage to match your wedding aesthetic. Your chauffeur will be formally attired, punctual, and fully briefed on your wedding day itinerary — including the ceremony venue, photography locations, and reception destination.")}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Corporate Limousine Service for Business Leaders
            </h2>
            <p>
              In the business world, time is the most valuable resource, and your ground transportation
              should respect that. BlackDrivo's corporate limousine service provides executives, business
              travelers, and corporate groups with reliable, professional, and comfortable transportation
              that keeps pace with the demands of modern business travel.
            </p>
            <p className="mt-4">
              Our corporate accounts offer monthly billing, priority booking, dedicated account
              management, and detailed expense reporting — everything your finance and travel teams need
              to manage corporate transportation efficiently. Our executive fleet, including the Mercedes
              Luxury Sprinter with its conference-ready seating layout, allows busy executives to work
              productively during transit, turning every ride into a productive extension of the
              boardroom.
            </p>
            <p className="mt-4">
              {r("For corporate roadshows, investor presentations, and multi-location itineraries, our full-day limousine hire packages provide exceptional value and the flexibility to adapt to changing schedules without penalty. BlackDrivo serves leading companies, law firms, financial institutions, and high-growth startups across the United States.")}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              VIP Limousine Service: Privacy and Discretion Guaranteed
            </h2>
            <p>
              {r("For high-profile clients who require an elevated standard of privacy, security, and discretion, BlackDrivo's VIP limousine service represents the pinnacle of luxury ground transportation. Our VIP chauffeurs are selected from the top tier of our driver pool, with additional training in confidentiality protocols, security awareness, and high-profile client management.")}
            </p>
            <p className="mt-4">
              {r("Our VIP limousine fleet features vehicles with full privacy tinting, partition screens, and all communications technology disabled in the passenger compartment upon request. We have served executives, artists, athletes, diplomats, and international visitors across all major US cities — delivering the kind of quiet, confident professionalism that true VIP clients expect and deserve.")}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Our Premium Limousine Fleet: Built for Every Occasion
            </h2>
            <p>
              BlackDrivo's limousine fleet is carefully curated to meet the diverse needs of our
              clientele. Our <strong className="text-gray-900">Stretch Limousines</strong>, based on
              Lincoln Town Car, Cadillac DTS, and Chrysler 300 platforms, are the iconic choice for
              weddings, proms, and milestone celebrations — seating up to 10 passengers in absolute
              luxury with LED fiber optic lighting, full wet bars, premium sound systems, and privacy
              partitions.
            </p>
            <p className="mt-4">
              Our <strong className="text-gray-900">Mercedes Luxury Sprinter Limos</strong> represent
              the next evolution in group luxury transportation. Seating up to 14 passengers in
              individual executive captain chairs, featuring twin flat-screen televisions, a built-in
              refrigerator, privacy shades, and 7 feet of standing room, the Sprinter Limo is the
              preferred choice for corporate groups, wedding parties, and VIP event transportation.
            </p>
            <p className="mt-4">
              For those who prefer the power and presence of a <strong className="text-gray-900">Cadillac Escalade</strong>,
              our Escalade limousine configuration delivers an extraordinary VIP experience with heated
              and cooled leather seating, Harman Kardon premium audio, LED fiber optic ceiling lighting,
              and a full bar area — all delivered with the commanding presence that only a Cadillac can provide.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              {r("Luxury Limousine Service Nationwide — Available in 40+ Cities")}
            </h2>
            <p>
              {r("BlackDrivo's luxury limousine service is available across the United States, with operations in all major metropolitan areas. From New York City and New Jersey to Los Angeles, Chicago, Miami, Dallas, Las Vegas, Phoenix, Seattle, Denver, and Boston — our network of professional chauffeurs and premium vehicles is ready to serve you wherever your travels take you.")}
            </p>
            <p className="mt-4">
              All BlackDrivo limousine pricing is completely fixed at the time of booking, regardless of
              traffic, weather, or demand. This means you always know exactly what you will pay before
              your trip begins — no surprises, no surge charges, and no unpleasant invoices after the
              fact. We believe transparent, honest pricing is the foundation of a genuine luxury
              experience.
            </p>
            <p className="mt-4">
              Ready to experience the BlackDrivo difference? Book your luxury limousine online in minutes
              or call our reservations team 24/7 at {phoneDisplay}. Our team is standing by to help
              you plan the perfect transportation experience — whether it is a single airport transfer or
              a complex multi-day corporate itinerary. BlackDrivo: where luxury meets reliability.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-4 py-28 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
            Reserve Your Limousine
          </p>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            Experience First-Class<br className="hidden md:block" /> Limousine Travel
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/55">
            {r("Reserve your luxury limousine today and travel with total confidence. Professional chauffeurs · Fixed pricing · 24/7 support")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={bookHref}
              className="inline-flex items-center gap-2 bg-[#C5A028] px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#A8871E]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:border-[#C5A028] hover:text-[#C5A028]"
            >
              Get a Quote
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={phoneHref}
              className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <Phone className="h-4 w-4 text-[#C5A028]" />
              {phoneDisplay}
            </a>
            <span className="hidden text-white/20 sm:block">·</span>
            <a
              href="https://wa.me/18005550199"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-[#C5A028]" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────────── */}
      <a
        href="https://wa.me/18005550199"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition hover:scale-110 hover:shadow-2xl"
      >
        <MessageCircle className="h-6 w-6 fill-white text-white" />
      </a>

      <Footer />
    </div>
  );
}
