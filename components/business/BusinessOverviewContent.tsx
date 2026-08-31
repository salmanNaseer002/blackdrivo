"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/animations";
import BusinessInquiryForm from "./BusinessInquiryForm";

const solutions = [
  {
    title: "Corporate Travel",
    description: "Centralized billing, travel policy controls, and priority support for your whole team.",
    href: "/business/corporate",
    image: "/el-thumb-1.webp",
  },
  {
    title: "Travel Partner",
    description: "Book on behalf of your clients with agency-friendly rates and dedicated support.",
    href: "/business/travel-partner",
    image: "/el-thumb-2.webp",
  },
  {
    title: "Business Partnerships",
    description: "Referral and concierge partnerships for hotels, venues, and event planners.",
    href: "/business/partnerships",
    image: "/el-thumb-3.webp",
  },
  {
    title: "Travel Agent",
    description: "Discounted, agent-only rates and dedicated support for booking client rides on their behalf.",
    href: "/business/travel-agent",
    image: "/el-thumb-4.webp",
  },
  {
    title: "On-Demand",
    description: "Instant, fixed-price bookings for individuals — no schedule or account needed.",
    href: "/business/on-demand",
    image: "/el-rectangle.webp",
  },
];

const benefitsUs = [
  { title: "NJ, Philadelphia & the tri-state area", desc: "Reliable coverage across every market we serve." },
  { title: "Transparent, distance-based pricing", desc: "No surge pricing. Know your cost before you book." },
  { title: "Flexible cancellations", desc: "Free changes up to 1 hour before pickup." },
  { title: "24/7 concierge support", desc: "A real person, always available for your team." },
  { title: "Consolidated invoicing", desc: "One monthly bill with detailed, exportable reporting." },
  { title: "Modern, well-maintained fleet", desc: "Late-model vehicles inspected before every trip." },
];

const benefitsPk = [
  { title: "Lahore, Karachi & Islamabad", desc: "Reliable coverage across every market we serve." },
  { title: "Transparent, distance-based pricing", desc: "No surge pricing. Know your cost before you book." },
  { title: "Flexible cancellations", desc: "Free changes up to 1 hour before pickup." },
  { title: "24/7 concierge support", desc: "A real person, always available for your team." },
  { title: "Consolidated invoicing", desc: "One monthly bill with detailed, exportable reporting." },
  { title: "Modern, well-maintained fleet", desc: "Late-model vehicles inspected before every trip." },
];

const stats = [
  { value: "500+", label: "Corporate clients" },
  { value: "4.9★", label: "Average rating" },
  { value: "99.8%", label: "On-time performance" },
  { value: "24/7", label: "Concierge support" },
];

export default function BusinessOverviewContent() {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  const benefits = isPk ? benefitsPk : benefitsUs;
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statsRef, offset: ["start end", "end start"] });
  const statsScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const statsOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen w-full items-end">
        <div className="fixed inset-0 z-0">
          <Image src="/el-thumb-1.webp" alt="" fill priority sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(10,15,26,0.35) 0%, rgba(10,15,26,0.65) 55%, rgba(10,15,26,0.9) 100%)",
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t from-white to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pb-20 pt-24 text-center md:px-6 md:pb-24 lg:px-8"
        >
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            {isPk ? "Drivers" : "Chauffeurs"} your company can always rely on.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
            One platform for corporate travel, agency bookings, and referral partnerships —
            with the transparency and support your business demands.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#business-form"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              Talk to our business team <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Solutions — 3 cards */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-7xl">
              A solution for every kind of business.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-3"
          >
            {solutions.map((s) => (
              <motion.article
                key={s.title}
                variants={fadeUp}
                className="group rounded-[2rem] p-3 transition-colors duration-300 hover:bg-blue-50"
              >
                <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 md:h-72">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-6 p-6">
                  <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{s.description}</p>
                  <Link
                    href={s.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform capabilities */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
            >
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                From planning to pickup.
              </h2>
              <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">
                Book airport transfers, daily commutes, or multi-city itineraries in minutes. Every
                trip is tracked in real time, every driver is vetted, and every invoice is itemized —
                so your team can focus on the meeting, not the ride.
              </p>
              <ul className="mt-8 space-y-3">
                {["Instant online booking & real-time tracking", "Traveler profiles & saved preferences", "Department-level cost allocation"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b66d1]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={scaleIn}
              className="relative h-80 overflow-hidden rounded-3xl md:h-[28rem]"
            >
              <Image
                src="/el-hero-bg.webp"
                alt="BlackDrivo business travel"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-14 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              Built for how business travels.
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp}>
                <p className="text-sm font-semibold text-gray-900">{b.title}</p>
                <p className="mt-1.5 text-sm leading-5 text-gray-500">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-gray-950 px-4 py-20 text-center md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto w-full max-w-3xl"
        >
          <p className="text-2xl font-medium leading-normal text-white md:text-4xl">
            &ldquo;BlackDrivo is the only car service our leadership team trusts for every
            business trip — punctual, professional, and never a surprise on the invoice.&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-white/50">
            Operations Director, Fortune 500 Client
          </p>
        </motion.div>
      </section>

      {/* Stats + bottom CTA */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-[1800px] text-center">
          <motion.div
            ref={statsRef}
            style={{ scale: statsScale, opacity: statsOpacity }}
            className="grid grid-cols-2 gap-y-10 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="px-2">
                <p className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-500 md:text-base">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Ready to move your business forward?
            </h2>
            <a
              href="#business-form"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              Talk to our business team <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <BusinessInquiryForm accountType="business" />
    </>
  );
}
