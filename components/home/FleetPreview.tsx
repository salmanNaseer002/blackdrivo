"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";

export default function FleetPreview({ region = "us" }: { region?: "us" | "pk" }) {
  const driverWord = region === "pk" ? "Driver" : "Chauffeur";
  return (
    <>
      {/* ── Always There For You — plain sticky, NO extra-height wrapper. A taller wrapper
          makes the sticky content release (scroll away) BEFORE AirportSection's opaque
          content has scrolled up far enough to cover it — leaving a gap where Hero's
          permanent `fixed` background peeks through. Sticky must stay engaged the entire
          time until AirportSection visually covers it; a wrapper exactly the section's own
          height (i.e. none) is what keeps it stuck for the whole hand-off. */}
      <section className="sticky top-0 z-0 flex min-h-screen items-center overflow-hidden">
        <Image
          src="/Exterior-with-door-open.jpg"
          alt={`Professional ${driverWord} Service`}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 py-20 text-center md:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
              Premium {driverWord} Service
            </p>
            <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Always There For You.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">
              Professional {driverWord.toLowerCase()}s available 24 hours a day, 7 days a week, 365 days a year.
              Wherever you need to go, BlackDrivo will be there.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(11,102,209,0.6)] transition hover:scale-[1.03] hover:bg-[#0952a8] active:scale-[0.98]"
              >
                Book Your Ride <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+18005550199"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:scale-[1.03] hover:bg-white/20 active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" /> Call 24/7
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
