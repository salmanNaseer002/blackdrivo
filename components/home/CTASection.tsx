"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Car, Building2 } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export default function CTASection() {
  return (
    <section className="relative z-10 w-full bg-white px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid gap-5 lg:grid-cols-2"
        >
          {/* Passenger CTA */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-3xl bg-gray-900 p-8 transition md:p-12"
          >
            <motion.div
              className="pointer-events-none absolute -bottom-8 -right-8 text-white/[0.05] transition-colors duration-500 group-hover:text-white/[0.08]"
              animate={{ y: [0, -16, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Car className="h-48 w-48" strokeWidth={0.75} />
            </motion.div>
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#3b8ff0]">For riders</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Book your first ride
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
                Experience premium chauffeur service across New Jersey, and the
                tri-state area. Book in under 2 minutes.
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
                {["Instant booking confirmation", "Fixed upfront pricing", "Luxury fleet"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                    <span className="h-1 w-1 rounded-full bg-[#3b8ff0]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/#book"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
              >
                Book now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Business CTA */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-3xl bg-gray-50 p-8 transition md:p-12"
          >
            <motion.div
              className="pointer-events-none absolute -bottom-8 -right-8 text-gray-900/[0.05] transition-colors duration-500 group-hover:text-gray-900/[0.08]"
              animate={{ y: [0, -16, 0], rotate: [0, -3, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Building2 className="h-48 w-48" strokeWidth={0.75} />
            </motion.div>
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">For business</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                BlackDrivo for Business
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
                Centralized billing, team travel management, and priority support for companies
                that demand the best.
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-gray-200 pt-6">
                {[
                  "Centralized invoicing & billing",
                  "Team accounts & travel policies",
                  "Dedicated account manager",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="h-1 w-1 rounded-full bg-[#0b66d1]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
                >
                  Contact sales <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services#corporate"
                  className="text-sm font-semibold text-gray-700 transition hover:text-gray-900"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Driver CTA strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-2 py-8 sm:flex-row"
        >
          <div>
            <p className="text-lg font-semibold text-gray-900">Drive with BlackDrivo</p>
            <p className="mt-1 text-sm text-gray-500">
              Join our network of professional chauffeurs and earn premium rates.
            </p>
          </div>
          <Link
            href="/driver"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
          >
            Apply to drive <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
