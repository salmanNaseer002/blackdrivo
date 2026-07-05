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

export const metadata: Metadata = {
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

const faqs = [
  {
    q: "What areas does BlackDrivo serve?",
    a: "BlackDrivo provides premium chauffeured transportation across New York City, New Jersey, and Philadelphia. We service all major airports including JFK, EWR, LGA, PHL, and HPN, as well as corporate offices, hotels, private terminals, and event venues throughout the tri-state area.",
  },
  {
    q: "How do I book a ride?",
    a: "You can book directly through our online booking platform, by phone, or by contacting our reservations team. We recommend booking at least 24 hours in advance for standard rides and 48+ hours for events or special requests.",
  },
  {
    q: "What types of vehicles are available?",
    a: "Our fleet includes executive luxury sedans (Mercedes-Benz S580, Lincoln Continental, Volvo S90), luxury SUVs (Cadillac Escalade, Chevrolet Suburban, Mercedes-Benz GLS), Mercedes-Benz Sprinter vans, stretch limousines, executive mini-buses, and full-size motor coaches.",
  },
  {
    q: "Are your prices fixed or metered?",
    a: "All BlackDrivo pricing is fixed-rate and confirmed at the time of booking. There are no meters, no surge pricing, and no surprises. The quoted price is the price you pay.",
  },
  {
    q: "What is the chauffeur dress code?",
    a: "Our chauffeurs maintain a professional appearance at all times — dark, well-tailored suit, white shirt, and tie — reflecting the executive nature of our service.",
  },
  {
    q: "Can I request a specific vehicle?",
    a: "Yes. You select your preferred vehicle class during booking. We guarantee the specific vehicle category you reserve, maintained to pristine showroom standards.",
  },
  {
    q: "How do you track flights for airport pickups?",
    a: "We use real-time FAA flight tracking data. Your chauffeur is automatically notified of any delays or early arrivals, and wait time is included from the moment of landing.",
  },
];

export default function AboutPage() {
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
          <div className="mx-auto w-full max-w-7xl px-4 pb-14 md:px-8 md:pb-18">

            <h1 className="font-['Georgia',serif] text-5xl font-bold leading-[1.08] text-white md:text-7xl">
              The Standard for<br />Premium Chauffeur Service.
            </h1>
            <div className="mt-5 h-[3px] w-36 bg-[#0b66d1]" />
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
              BlackDrivo is a premier luxury transportation company serving corporate clients,
              private travelers, VIP guests, and event planners across New York City,
              New Jersey, and Philadelphia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
              >
                Book a Ride <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Are ────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Text */}
            <div>
              <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
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

      {/* ── Our Mission ───────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-20 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Image */}
            <div className="relative h-[420px] overflow-hidden order-last lg:order-first">
              <Image
                src="/el-image-1.webp"
                alt="BlackDrivo fleet lineup"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 200vw"
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl">
                Every Client is Our Most Important Client.
              </h2>
              <div className="mt-5 h-[3px] w-16 bg-[#0b66d1]" />
              <p className="mt-6 text-base leading-7 text-white/65">
                At BlackDrivo, we guarantee 100% client satisfaction on every engagement. Whether you
                are an executive heading to a board meeting or arriving at JFK after a long international
                flight — you deserve professionalism, punctuality, and peace of mind.
              </p>
              <p className="mt-4 text-base leading-7 text-white/65">
                Our mission is to provide safe, elegant, and dependable transportation that reflects
                the highest standards of luxury service. BlackDrivo — premium chauffeur service
                with local precision.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { v: "4.9★",  l: "Client Rating"      },
                  { v: "100%",  l: "Satisfaction Guarantee" },
                ].map((s) => (
                  <div key={s.l} className="border border-white/10 bg-white/5 p-5">
                    <p className="text-2xl font-extrabold text-white">{s.v}</p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Commitment ────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="mb-14 text-center">
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              Our Commitment to You
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500">
              Every decision we make — from the vehicles we select to the chauffeurs we hire — is
              guided by one principle: your experience must be exceptional.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c) => (
              <div
                key={c.title}
                className="border border-gray-100 bg-white p-8 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center bg-[#0b66d1]/8">
                  <c.icon className="h-6 w-6 text-[#0b66d1]" />
                </div>
                <h3 className="font-['Georgia',serif] text-xl font-bold text-gray-900">{c.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chauffeurs ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
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
                  href="/driver"
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

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
  <div className="mx-auto w-full max-w-5xl">
    <div className="mb-12 text-center">
      <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900">
        Frequently Asked Questions
      </h2>
    </div>

    <div className="divide-y divide-gray-100 border-y border-gray-100">
      {faqs.map((faq) => (
        <details key={faq.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
            <span className="text-sm font-semibold text-gray-900">
              {faq.q}
            </span>
            <span className="mt-0.5 shrink-0 text-[#0b66d1]">
  <svg
    className="h-5 w-5 transition-transform duration-300 group-open:rotate-45"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5v14M5 12h14"
    />
  </svg>
</span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-gray-500">{faq.a}</p>
        </details>
      ))}
    </div>
  </div>
</section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-20 md:px-6 lg:px-8">
        <div className="w-full">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>

              <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl">
                Book Your Ride with BlackDrivo Today.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/60">
                Join thousands of satisfied clients who trust BlackDrivo for every important journey
                — from airport transfers to corporate events and private occasions.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
                >
                  Book a Ride <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+18005550199"
                  className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
                >
                  <Phone className="h-4 w-4" /> Call 24/7
                </a>
              </div>
            </div>
            <div className="relative h-72 overflow-hidden lg:h-80">
              <Image
                src="/about-r8HjcS.jpeg"
                alt="BlackDrivo luxury service"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[#0b66d1]/20" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
