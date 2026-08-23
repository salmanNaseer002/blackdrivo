"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import BookingWidget from "./BookingWidget";

export default function HeroSection() {
  return (
    <section
      id="book"
      className="relative flex min-h-screen w-full items-end"
    >
      {/* Background stays pinned to the viewport (fixed, not tied to this section's own scroll
          position) — only the content below scrolls, so the photo freezes while the widget moves. */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/BlackDrivo Main Page - 2403x1603.png"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={65}
          className="object-cover"
          style={{ objectPosition: "center 30%" }}
        />

        {/* Darkening gradient over the photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(10,15,26,0.28) 0%, rgba(10,15,26,0.58) 55%, rgba(10,15,26,0.88) 100%)",
          }}
        />
      </div>

      {/* Gradient overlay bottom — fades to white, also gives the trust-badge row readable contrast */}
      <div className="absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pb-8 pt-24 md:px-6 md:pb-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-white"
        >

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Your <span className="text-[#0b66d1]">chauffeur</span> awaits.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
            Premium black car service across New Jersey, and all surrounding areas.
            Airport transfers, hourly rides, and city-to-city travel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          id="booking-widget"
          className="mt-16 scroll-mt-28 md:mt-10"
        >
          <BookingWidget />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50"
        >
          {["Flight tracking included", "No hidden fees", "24/7 support", "Instant confirmation"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#0b66d1]" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
