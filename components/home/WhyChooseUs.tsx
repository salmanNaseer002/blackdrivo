"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Headphones, CreditCard, Smartphone, Clock } from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    title: "Vetted Professionals",
    description: "Every driver undergoes rigorous background checks, licensing verification, and service training.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    description: "Fully insured vehicles, real-time GPS tracking, and transparent trip details before every booking.",
  },
  {
    icon: Headphones,
    title: "24/7 Live Support",
    description: "Our support team is available around the clock via phone, email, or chat — before, during, and after your trip.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description: "Your fare is shown upfront. No surge pricing, no hidden fees. What you see is what you pay.",
  },
  {
    icon: Smartphone,
    title: "Easy Booking",
    description: "Book in minutes on any device. Manage, modify, or cancel your ride with a few taps.",
  },
  {
    icon: Clock,
    title: "Always On Time",
    description: "Our drivers arrive early and track your schedule to ensure punctual pickups every time.",
  },
];

const stats = [
  { value: "50,000+", label: "Rides completed" },
  { value: "4.9★", label: "Average rating" },
  { value: "500+", label: "Vetted drivers" },
  { value: "24/7", label: "Customer support" },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 grid grid-cols-2 gap-px rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-white p-6 text-center ${i < stats.length - 1 ? "border-r border-gray-100" : ""}`}
            >
              <p className="text-3xl font-bold text-gray-900 md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Why BlackDrivo
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Premium isn&apos;t just
              <br />a vehicle class.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              It&apos;s the professionalism of every driver, the punctuality of every pickup, and the
              peace of mind that comes from knowing everything is handled.
            </p>
            <div className="mt-8">
              <div
                className="relative h-64 overflow-hidden rounded-2xl md:h-80"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(10,15,26,0.15) 0%, rgba(10,15,26,0.55) 100%), url('/Departure%202.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-black/40 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">
                    &ldquo;BlackDrivo is the only car service I trust for every business trip.&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-white/60">— James R., VP Operations, Fortune 500</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 transition hover:shadow-md hover:border-[#0b66d1]/25"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <reason.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{reason.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-gray-500">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
