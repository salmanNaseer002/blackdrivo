"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Car, Briefcase } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Passenger CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl bg-[#0b66d1] p-8 md:p-10"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)",
            }}
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 right-12 h-32 w-32 rounded-full bg-black/15" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                Book your first ride
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
                Experience premium chauffeur service across New Jersey, and the
                tri-state area. Book in under 2 minutes.
              </p>
              <ul className="mt-5 space-y-2">
                {["Instant booking confirmation", "Fixed upfront pricing", "Luxury fleet"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/booking"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b66d1] transition hover:bg-gray-100"
              >
                Book now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Business CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 md:p-10"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#0b66d1]/8" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b66d1]/20">
                <Briefcase className="h-6 w-6 text-[#0b66d1]" />
              </div>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                BlackDrivo for Business
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
                Centralized billing, team travel management, and priority support for companies
                that demand the best.
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Centralized invoicing & billing",
                  "Team accounts & travel policies",
                  "Dedicated account manager",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/75">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0b66d1]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
                >
                  Contact sales <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services#corporate"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Driver CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gray-50 border border-gray-200 px-6 py-5 sm:flex-row"
        >
          <div>
            <p className="font-semibold text-gray-900">Drive with BlackDrivo</p>
            <p className="text-sm text-gray-500">
              Join our network of professional chauffeurs and earn premium rates.
            </p>
          </div>
          <Link
            href="/driver"
            className="shrink-0 rounded-full bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Apply to drive
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
