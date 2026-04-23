"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function HeroSection() {
  const [activeBookingField, setActiveBookingField] = useState<
    "pickup" | "dropoff" | "date" | "time" | null
  >(null);

  return (
    <section
      className="relative h-screen min-h-[100svh] w-full overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(8,12,20,0.28), rgba(8,12,20,0.58)), url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        className="mx-auto flex h-full min-h-[100svh] w-full max-w-[1240px] items-end px-4 pb-8 pt-20 md:px-6 md:pb-12 md:pt-24"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full text-center text-white">
          <h1 className="text-[52px] font-medium tracking-tight md:text-7xl">
            Your chauffeur awaits.
          </h1>
          <div className="mx-auto mt-5 inline-flex rounded-full border border-white/35 bg-black/30 p-1 text-xs md:mt-6 md:text-sm">
            <button type="button" className="rounded-full bg-[#0b66d1] px-5 py-2 font-medium md:px-6">
              One way
            </button>
            <button type="button" className="px-5 py-2 font-medium text-white/90 md:px-6">
              By the hour
            </button>
          </div>

          <div
            className={`mt-6 rounded-xl border border-white/35 bg-black/35 text-left backdrop-blur transition-all duration-300 md:mt-8 ${
              activeBookingField ? "p-4" : "p-3"
            }`}
          >
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto]">
              <button
                type="button"
                onClick={() => setActiveBookingField("pickup")}
                className="h-14 px-3 text-left md:border-r md:border-white/20 md:px-4"
              >
                <p className="text-xs text-white/85">Pickup location</p>
                <p
                  className={`mt-1 text-base leading-none text-white/85 md:text-[31px] ${
                    activeBookingField === "pickup"
                      ? "border-b-2 border-[#0b66d1] pb-1"
                      : "border-b border-white/30 pb-1"
                  }`}
                >
                  Address, airport, hotel, ...
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveBookingField("dropoff")}
                className="h-14 px-3 text-left md:border-r md:border-white/20 md:px-4"
              >
                <p className="text-xs text-white/85">Drop-off location</p>
                <p
                  className={`mt-1 text-base leading-none text-white/85 md:text-[31px] ${
                    activeBookingField === "dropoff"
                      ? "border-b-2 border-[#0b66d1] pb-1"
                      : "border-b border-white/30 pb-1"
                  }`}
                >
                  Address, airport, hotel, ...
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveBookingField("date")}
                className="h-14 px-3 text-left md:border-r md:border-white/20 md:px-4"
              >
                <p className="text-xs text-white/85">Date</p>
                <p
                  className={`mt-1 flex items-center justify-between text-base leading-none text-white/90 md:text-[31px] ${
                    activeBookingField === "date"
                      ? "border-b-2 border-[#0b66d1] pb-1"
                      : "border-b border-white/30 pb-1"
                  }`}
                >
                  <span>Select a date</span>
                  <span className="text-lg">⌄</span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveBookingField("time")}
                className="h-14 px-3 text-left md:border-r md:border-white/20 md:px-4"
              >
                <p className="text-xs text-white/85">Pickup time</p>
                <p
                  className={`mt-1 flex items-center justify-between text-base leading-none text-white/90 md:text-[31px] ${
                    activeBookingField === "time"
                      ? "border-b-2 border-[#0b66d1] pb-1"
                      : "border-b border-white/30 pb-1"
                  }`}
                >
                  <span>7:00 AM</span>
                  <span className="text-lg">⌄</span>
                </p>
              </button>

              <button
                type="button"
                className="h-12 self-center rounded-full bg-[#0b66d1] px-6 text-sm font-semibold text-white md:h-14"
              >
                View options
              </button>
            </div>

            {activeBookingField ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex h-[170px] items-center justify-center md:h-[260px]"
              >
                <div className="text-center">
                  <div className="mx-auto mb-5 h-4 w-4 rounded-full bg-[#0b66d1]" />
                  <p className="font-serif text-3xl leading-tight text-white/95 md:text-[52px]">
                    Set your pickup in over 64 countries.
                  </p>
                  <p className="font-serif text-3xl leading-tight text-white/95 md:text-[52px]">
                    We&apos;ll be there on time.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
