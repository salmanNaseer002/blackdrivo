"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, ChevronDown } from "lucide-react";
import DriverHeroSlider from "@/components/driver/DriverHeroSlider";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/animations";

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

const requirements = [
  "Valid driver's license (TLC required in NYC)",
  "A clean driving record",
  "A late-model, well-maintained luxury vehicle",
  "Professional appearance and communication",
  "Ability to pass a background check",
  "Commitment to the BlackDrivo Standard of service",
];

const faqs = [
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

export default function PartnerLandingContent() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero — full-screen image slider */}
      <DriverHeroSlider />

      {/* Unlock New Demand — 2 cards / phone mockup / 2 cards */}
      <section className="flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-14 text-center"
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
                  className="flex min-h-[19rem] w-full max-w-sm flex-col justify-center rounded-xl bg-blue-50 p-8 lg:mx-auto"
                >
                  <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{c.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mx-auto w-72 lg:w-80">
              <div className="relative aspect-[9/19] overflow-hidden rounded-xl border-[6px] border-gray-900 bg-gray-900 shadow-xl">
                <Image
                  src="/drive-hero.webp"
                  alt="BlackDrivo driver app"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {rightCards.map((c) => (
                <motion.div
                  key={c.title}
                  variants={fadeUp}
                  className="flex min-h-[19rem] w-full max-w-sm flex-col justify-center rounded-xl bg-blue-50 p-8 lg:mx-auto"
                >
                  <h3 className="text-lg font-bold text-gray-900">{c.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{c.description}</p>
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

      {/* Onboarding ↔ Requirements — tabbed */}
      <section id="how-it-works" className="flex min-h-[50vh] w-full items-center bg-white px-4 py-8 md:px-6 lg:px-8">
        <PartnerTabsContent />
      </section>

      {/* FAQ — accordion left, image right */}
      <section className="flex min-h-[50vh] w-full items-center border-t border-gray-100 bg-gray-50 px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-6 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Common questions</h2>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              className="divide-y divide-gray-200 border-y border-gray-200"
            >
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-3">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{faq.a}</p>
                </details>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={scaleIn}
              className="relative h-56 overflow-hidden rounded-3xl md:h-72"
            >
              <Image
                src="/Exterior-with-door-open.jpg"
                alt="BlackDrivo partner opening the vehicle door"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
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

      <Footer />
    </div>
  );
}

function PartnerTabsContent() {
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
              {requirements.map((r) => (
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
