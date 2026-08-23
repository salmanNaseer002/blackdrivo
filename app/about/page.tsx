// ── About page temporarily disabled — not deleted. The real implementation
// below is kept fully intact but is no longer the route's default export or
// metadata (JSX comments inside the component make a literal /* */ block-
// comment wrap unsafe, so it's disabled by renaming its exports instead).
// To re-enable: delete the `AboutPageDisabled` export below, then restore
// `export default` on `AboutPage` and `export const` on `pageMetadata`.
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  Shield, Award, Clock, Globe,
  Users, HeartHandshake, ArrowRight, Phone,
  CheckCircle, Star
} from "lucide-react";
import type { Metadata } from "next";

export default function AboutPageDisabled() {
  notFound();
}

const pageMetadata: Metadata = {
  title: "About BlackDrivo | Premium Chauffeur Service NJ, Philadelphia",
  description:
    "BlackDrivo is a premier luxury chauffeur service serving corporate clients, private travelers, and VIP guests across New Jersey, and Philadelphia. Professionalism, discretion, and excellence on every ride.",
};

const stats = [
  { value: "24/7",  label: "Dispatch Support"   },
  { value: "1",     label: "States Served"       },
  { value: "99.8%", label: "On-Time Performance" },
];

const commitments = [
  {
    icon: Clock,
    title: "Punctuality",
    description:
      "We track your flight in real time, monitor live traffic, and dispatch your chauffeur early. Arriving on time — every time — is our most sacred promise.",
  },
  {
    icon: Shield,
    title: "Vetted Chauffeurs",
    description:
      "Every BlackDrivo chauffeur passes a rigorous background check, defensive driving certification, and non-disclosure training before their first ride.",
  },
  {
    icon: Award,
    title: "Immaculate Fleet",
    description:
      "Every vehicle is sanitized between each engagement using hospital-grade protocols. Our late-model fleet is inspected before every single trip.",
  },
  {
    icon: HeartHandshake,
    title: "Absolute Discretion",
    description:
      "Confidentiality is not optional. Our chauffeurs are trained in strict non-disclosure protocols — ideal for executives, legal counsel, and VIP travelers.",
  },
  {
    icon: Globe,
    title: "Seamless Booking",
    description:
      "Book your ride, request a quote, or manage upcoming trips through our platform or mobile app — available around the clock, with live support.",
  },
  {
    icon: Users,
    title: "Every Client Matters",
    description:
      "Whether you are an executive on a roadshow or a family arriving at the airport, every BlackDrivo client receives the same five-star standard.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[80vh] flex-col overflow-hidden">
        <Image
          src="/about-N3x1NI.webp"
          alt="BlackDrivo premium fleet"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,12,22,0.40) 0%, rgba(8,12,22,0.65) 45%, rgba(8,12,22,0.95) 80%, rgba(8,12,22,1) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-1 flex-col justify-end">
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-8 md:pb-18">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#3b8ff0]">
              About BlackDrivo
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] text-white md:text-7xl">
              The Standard for Premium Chauffeur Service.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
              BlackDrivo is a premier luxury transportation company serving corporate clients,
              private travelers, VIP guests, and event planners across New York City,
              New Jersey, and Philadelphia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
              >
                Book a Ride <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8 max-w-xl">
              {stats.map((s) => (
                <div key={s.label} className="px-4 first:pl-0">
                  <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Text */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Who We Are
              </h2>
              <div className="mt-5 h-[3px] w-16 bg-[#0b66d1]" />
              <p className="mt-6 text-base leading-7 text-gray-600">
                BlackDrivo was founded with a singular commitment: deliver world-class chauffeured
                transportation to the tri-state area — the kind of service that executives,
                frequent travelers, and discerning individuals deserve on every ride.
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                We are not simply a car service. We are a professional transportation team that
                understands what high-value clients expect: punctual chauffeurs, immaculate vehicles,
                responsive communication, and a seamless booking process — from reservation
                to final drop-off.
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                BlackDrivo specializes in corporate and executive transportation, while also proudly
                serving private clients for weddings, celebrations, airport transfers, private aviation,
                and special events. Whether you need one luxury sedan or a coordinated fleet of vehicles,
                our team delivers tailored solutions with the same level of care and precision.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Serving New Jersey & Philadelphia",
                  "Corporate, VIP & private travel",
                  "Fixed-rate pricing — no surprises",
                  "24/7 reservations and dispatch support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative h-[480px] overflow-hidden">
                <Image
                  src="/about-VIVGzd.jpeg"
                  alt="BlackDrivo premium fleet at luxury hotel"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl">
                <p className="text-3xl font-extrabold text-gray-900">99.8%</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">On-Time Performance</p>
                <p className="mt-1 text-xs text-gray-500">Across all service categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Commitment ────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3b8ff0]">
              Why clients trust us
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Our Commitment to You
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/50">
              Every decision we make — from the vehicles we select to the chauffeurs we hire — is
              guided by one principle: your experience must be exceptional.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c, i) => (
              <div
                key={c.title}
                className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 transition hover:bg-white/[0.07]"
              >
                <div
                  className="animate-float-slow pointer-events-none absolute -bottom-6 -right-6 text-white/[0.04]"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <c.icon className="h-32 w-32" strokeWidth={0.75} />
                </div>
                <div className="relative">
                  <c.icon className="h-7 w-7 text-[#3b8ff0]" />
                  <h3 className="mt-5 text-xl font-bold text-white">{c.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/50">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chauffeurs ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Behind Every Great Ride is an Exceptional Chauffeur.
              </h2>
              <div className="mt-5 h-[3px] w-16 bg-[#0b66d1]" />
              <p className="mt-6 text-base leading-7 text-gray-600">
                Our chauffeurs are not simply drivers. They are professionals — discreet, punctual,
                and trained to deliver a consistently elevated passenger experience on every trip.
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Every BlackDrivo chauffeur undergoes a rigorous multi-stage vetting process including
                criminal background screening, DMV record review, defensive driving certification,
                and customer service training aligned with our luxury service standard.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Rigorous background checks & DMV screening",
                  "Defensive driving & emergency protocol training",
                  "Strict non-disclosure and privacy protocols",
                  "Full luggage handling and door-to-door assistance",
                  "Real-time monitored by 24/7 operations center",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" /> {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-2 border border-gray-900 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-900 transition hover:bg-gray-900 hover:text-white"
                >
                  Drive with Us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative h-[500px] overflow-hidden">
              <Image
                src="/el-thumb-1.webp"
                alt="BlackDrivo professional chauffeur"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#0b66d1] text-[#0b66d1]" />
                  ))}
                </div>
                <p className="text-sm text-white/80 leading-5">&ldquo;Professional, punctual, and completely discreet. Exactly what our executive clients require.&rdquo;</p>
                <p className="mt-2 text-xs font-semibold text-white/50">Corporate Client — Manhattan, NY</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>

              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Book Your Ride with BlackDrivo Today.
              </h2>
              <p className="mt-5 text-base leading-7 text-gray-600">
                Join thousands of satisfied clients who trust BlackDrivo for every important journey
                — from airport transfers to corporate events and private occasions.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#book"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
                >
                  Book a Ride <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+18005550199"
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-8 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                >
                  <Phone className="h-4 w-4" /> Call 24/7
                </a>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden rounded-3xl lg:h-80">
              <Image
                src="/about-r8HjcS.jpeg"
                alt="BlackDrivo luxury service"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[#0b66d1]/10" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
