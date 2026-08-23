"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { ServiceEntry } from "@/lib/services/data";
import BookingWidget from "@/components/home/BookingWidget";

export default function ServiceDetailContent({ service }: { service: ServiceEntry }) {
  return (
    <>
      {/* Header — same structure as the homepage Hero: fixed background photo (this card's own image), content pinned to the bottom */}
      <section id="book" className="relative flex min-h-screen w-full items-end">
        <div className="fixed inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(10,15,26,0.28) 0%, rgba(10,15,26,0.58) 55%, rgba(10,15,26,0.88) 100%)",
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pb-8 pt-24 md:px-6 md:pb-16 lg:px-8">
          <motion.h1
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="text-center text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            {service.title}
          </motion.h1>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mx-auto mt-10 max-w-6xl shadow-2xl shadow-black/40 md:mt-10"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </section>

      {/* Details — flat, no boxed cards; image already shown in the header above.
          relative z-10 is required: the hero above is `fixed`, so anything after it
          needs to be explicitly stacked above that fixed layer or its own background
          never actually paints over it. */}
      <section className="relative z-10 bg-white px-4 py-16 md:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl">
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="text-base leading-7 text-gray-600 md:text-lg"
          >
            {service.description}
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-8 divide-y divide-gray-100 border-t border-gray-100"
          >
            {service.features.map((f) => (
              <motion.li
                key={f}
                variants={fadeUp}
                className="flex items-center gap-3 py-3.5"
              >
                <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                <span className="text-sm font-medium text-gray-700">{f}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <Link
              href="#book"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
