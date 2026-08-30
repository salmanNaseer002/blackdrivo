"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, ChevronDown, Building2, Car } from "lucide-react";
import DriverHeroSlider from "@/components/driver/DriverHeroSlider";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const leftCards = [
  {
    title: "Grow Your Business",
    description:
      "Earn more with competitive rates, consistent ride opportunities, and reliable payments.",
  },
  {
    title: "Work Smarter",
    description:
      "Manage bookings, schedules, and trip details through a simple platform designed to make operations easier.",
  },
];

const rightCards = [
  {
    title: "Choose What Works for You",
    description:
      "From airport pickups to hourly bookings and long-distance trips, select the rides that best fit your availability and business.",
  },
  {
    title: "We've Got Your Back",
    description:
      "Get responsive partner support and dedicated assistance whenever you need help with a ride or account.",
  },
];

const steps = [
  { num: "01", title: "Submit your application", desc: "Share your basic details and professional driving experience." },
  { num: "02", title: "Application review", desc: "Our team reviews it against current coverage needs and qualifications." },
  { num: "03", title: "Screening & next steps", desc: "A strong match moves forward to a short screening conversation." },
  { num: "04", title: "Onboarding", desc: "Qualified partners complete onboarding and join the BlackDrivo network." },
];

const requirementsUS = [
  "Valid driver's license (TLC required in NYC)",
  "A clean driving record",
  "A late-model, well-maintained luxury vehicle",
  "Professional appearance and communication",
  "Ability to pass a background check",
  "Commitment to the BlackDrivo Standard of service",
];

const requirementsPk = [
  "Valid driver's license",
  "A clean driving record",
  "A late-model, well-maintained luxury vehicle",
  "Professional appearance and communication",
  "Ability to pass a background check",
  "Commitment to the BlackDrivo Standard of service",
];

const faqsUS = [
  {
    q: "What licenses and documents are required?",
    a: "All candidates must possess a valid driver's license and a clean driving record. In New York City, a TLC license is required. In New Jersey and Philadelphia, professional driving experience is preferred. All candidates must pass a background check and complete our BlackDrivo Standard training.",
  },
  {
    q: "How does the pay structure work?",
    a: "We offer highly competitive, fixed-rate bookings with weekly payments. Partner chauffeurs receive stable pay plus performance bonuses.",
  },
  {
    q: "Do I keep my tips?",
    a: "Absolutely. Chauffeurs retain 100% of all gratuities provided by clients.",
  },
  {
    q: "Can I choose my own schedule?",
    a: "Yes. We offer morning, evening, and weekend rotations, and our system lets you plan ahead — especially for high-demand periods like airport transfers and corporate events.",
  },
  {
    q: "How is this different from ride-sharing?",
    a: "Unlike ride-sharing, BlackDrivo provides a stable, high-volume environment with a pre-vetted, premium clientele. You won't compete with thousands of other drivers for a single ride — it's a career path within a professional chauffeur network.",
  },
];

const faqsPk = [
  {
    q: "What licenses and documents are required?",
    a: "All candidates must possess a valid driver's license and a clean driving record. Professional driving experience across Lahore, Karachi, and Islamabad is preferred. All candidates must pass a background check and complete our BlackDrivo Standard training.",
  },
  {
    q: "How does the pay structure work?",
    a: "We offer highly competitive, fixed-rate bookings with weekly payments. Partner drivers receive stable pay plus performance bonuses.",
  },
  {
    q: "Do I keep my tips?",
    a: "Absolutely. Drivers retain 100% of all gratuities provided by clients.",
  },
  {
    q: "Can I choose my own schedule?",
    a: "Yes. We offer morning, evening, and weekend rotations, and our system lets you plan ahead — especially for high-demand periods like airport transfers and corporate events.",
  },
  {
    q: "How is this different from ride-sharing?",
    a: "Unlike ride-sharing, BlackDrivo provides a stable, high-volume environment with a pre-vetted, premium clientele. You won't compete with thousands of other drivers for a single ride — it's a career path within a professional driver network.",
  },
];

const VENDOR_APPLICATION_URL = "https://vendor.blackdrivo.com/registration";

export default function PartnerLandingContent() {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  const faqs = isPk ? faqsPk : faqsUS;
  const requirements = isPk ? requirementsPk : requirementsUS;
  const [mode, setMode] = useState<"vendor" | "driver">("driver");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero — full-screen image slider */}
      <DriverHeroSlider />

      {/* As Vendor / As Driver toggle */}
      <section className="border-b border-gray-100 bg-white px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-5 text-sm text-gray-500">How would you like to partner with BlackDrivo?</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1.5">
            <button
              onClick={() => setMode("vendor")}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                mode === "vendor" ? "bg-[#0b66d1] text-white" : "text-gray-500 hover:text-[#0b66d1]"
              }`}
            >
              <Building2 className="h-4 w-4" /> As Vendor
            </button>
            <button
              onClick={() => setMode("driver")}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                mode === "driver" ? "bg-[#0b66d1] text-white" : "text-gray-500 hover:text-[#0b66d1]"
              }`}
            >
              <Car className="h-4 w-4" /> As Driver
            </button>
          </div>
        </div>
      </section>

      {mode === "vendor" ? (
        <VendorSection />
      ) : (
        <>

      {/* Unlock New Demand — 2 cards / phone mockup / 2 cards */}
      <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-8 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Unlock New Demand
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
              Connect with premium customers through BlackDrivo&apos;s platform and website.
              Choose the rides that fit your schedule and grow your business on your terms.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {leftCards.map((c) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  className="flex min-h-[250px] w-full max-w-lg flex-col items-center justify-center rounded-xl bg-black p-8 text-center shadow-lg lg:mx-auto"
                >
                  <h3 className="text-lg font-bold text-white">{c.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{c.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mx-auto w-60 lg:w-64">
              <div className="relative aspect-[9/19] overflow-hidden rounded-[2.5rem] border-[8px] border-black bg-black shadow-2xl">
                <Image
                  src="/drive-hero.webp"
                  alt="BlackDrivo driver app"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
                {/* Notch */}
                <div className="absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />
                {/* Home indicator */}
                <div className="absolute bottom-1.5 left-1/2 z-10 h-1 w-28 -translate-x-1/2 rounded-full bg-white/80" />
              </div>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {rightCards.map((c) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  className="flex min-h-[250px] w-full max-w-lg flex-col items-center justify-center rounded-xl bg-black p-8 text-center shadow-lg lg:mx-auto"
                >
                  <h3 className="text-lg font-bold text-white">{c.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{c.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="flex min-h-[50vh] w-full items-center justify-center bg-gray-50 px-4 py-16 text-center md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Moving Toward Greener Mobility
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500">
            BlackDrivo is committed to building a more sustainable transportation network by
            supporting cleaner vehicles, smarter operations, and environmentally responsible
            travel. Together, we can make every journey better for people and the planet.
          </p>
        </motion.div>
      </section>

      {/* Single testimonial, with a concrete metric */}
      <section className="flex min-h-[50vh] w-full items-center justify-center bg-gray-950 px-4 py-16 text-center md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-3xl"
        >
          <p className="text-2xl font-medium leading-normal text-white md:text-4xl">
            &ldquo;I&apos;ve been with BlackDrivo for 2 years. The corporate clients are consistent,
            the rides are straightforward, and the pay is always on time.&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-white/50">
            Robert T. — Manhattan, NY · $4,100/mo avg
          </p>
        </motion.div>
      </section>

      {/* Common questions (left) ↔ How to become a partner (right) */}
      <section id="how-it-works" className="flex min-h-screen w-full items-center bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                className="mb-6"
              >
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Common questions</h2>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={fadeUp}
                className="divide-y divide-gray-200 border-y border-gray-200"
              >
                {faqs.map((faq: { q: string; a: string }) => (
                  <details key={faq.q} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                      <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-gray-500">{faq.a}</p>
                  </details>
                ))}
              </motion.div>
            </div>

            <PartnerTabsContent requirements={requirements} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-950 px-4 py-20 text-center md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-4xl font-bold text-white md:text-5xl">Ready to start earning?</h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-white/60">
            Applications take 10 minutes. Most decisions come back within 2–3 business days.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/driver/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              Apply to Drive <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" /> Call 24/7
            </a>
          </div>
        </motion.div>
      </section>

      {/* App Download */}
      <section className="bg-white px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-gray-50 p-8 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-gray-900">Manage rides on the go with the BlackDrivo Driver app</p>
            <p className="mt-1 text-sm text-gray-500">Accept trips, track earnings, and stay in touch with dispatch — all from your phone.</p>
          </div>
          <div className="flex gap-3">
            <a href="#" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 transition hover:bg-gray-100">
              <svg className="h-7 w-7 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <p className="text-xs text-gray-500">Download on the</p>
                <p className="text-sm font-semibold text-gray-900">App Store</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 transition hover:bg-gray-100">
              <svg className="h-7 w-7 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.26-2.75-2.75-10.84 9.81zM.54 1.18C.2 1.51 0 2.06 0 2.78v18.44c0 .72.2 1.27.54 1.6l.08.08 10.33-10.33v-.24L.62 1.1l-.08.08zM20.4 10.66l-2.94-1.7-3.07 3.07 3.07 3.07 2.96-1.71c.84-.49.84-1.24-.02-1.73zM3.18.24L15.78 7.5l-2.75 2.75L2.19.44c.3-.37.68-.37.99-.2z"/>
              </svg>
              <div>
                <p className="text-xs text-gray-500">Get it on</p>
                <p className="text-sm font-semibold text-gray-900">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </section>

        </>
      )}

      <Footer />
    </div>
  );
}

function VendorSection() {
  return (
    <>
      {/* Vendor intro */}
      <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Fleet Vendor Partnership</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Register Your Fleet
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500">
            If you operate a fleet of drivers and vehicles, partner with BlackDrivo as a vendor.
            Manage your own drivers, receive ride assignments, and grow your business with a
            reliable premium mobility platform.
          </p>

          <div className="mx-auto mt-12 grid gap-5 text-left sm:grid-cols-2">
            {[
              { title: "Manage Your Own Fleet", desc: "Onboard and assign your own drivers and vehicles to rides under your vendor account." },
              { title: "Consistent Ride Volume", desc: "Access a steady stream of premium bookings from BlackDrivo's platform." },
              { title: "Transparent Payouts", desc: "Clear, scheduled settlements for every completed ride your fleet serves." },
              { title: "Dedicated Support", desc: "A partner support team to help with onboarding, documents, and account questions." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="text-base font-bold text-gray-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-8">
            <h3 className="text-lg font-bold text-gray-900">Submit your vendor application</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Fill out the vendor application form with your fleet and company details. Our team
              reviews every application, and you&apos;ll receive an email once your application has
              been reviewed.
            </p>
            <a
              href={VENDOR_APPLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              Apply as Vendor <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function PartnerTabsContent({ requirements }: { requirements: string[] }) {
  const [tab, setTab] = useState<"onboarding" | "requirements">("onboarding");

  return (
    <div id="how-it-works" className="mx-auto max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-6 text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            How to become a partner.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-6 flex items-center justify-center gap-2"
        >
          <button
            onClick={() => setTab("onboarding")}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
              tab === "onboarding" ? "bg-[#0b66d1] text-white" : "text-gray-500 hover:text-[#0b66d1]"
            }`}
          >
            Onboarding
          </button>
          <button
            onClick={() => setTab("requirements")}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
              tab === "requirements" ? "bg-[#0b66d1] text-white" : "text-gray-500 hover:text-[#0b66d1]"
            }`}
          >
            Requirements
          </button>
        </motion.div>

        {tab === "onboarding" ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="space-y-3"
          >
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-400">The process</h3>
            {steps.map((s) => (
              <motion.div key={s.num} variants={fadeUp} className="flex gap-5">
                <p className="text-2xl font-extrabold text-[#0b66d1]/25">{s.num}</p>
                <div>
                  <h4 className="text-base font-bold text-gray-900">{s.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-gray-500">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-400">What you&apos;ll need</h3>
            <div className="mt-4 space-y-3">
              {requirements.map((r: string) => (
                <motion.div key={r} variants={fadeUp} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" /> {r}
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Link
                href="/driver/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}
