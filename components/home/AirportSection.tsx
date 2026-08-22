"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plane, Clock, MapPin, CheckCircle } from "lucide-react";
import { slideInLeft, slideInRight, viewportOnce } from "@/lib/animations";

const features = [
  { icon: Plane, title: "Live Flight Tracking", desc: "We monitor your flight in real-time. Delayed or early — your driver adjusts automatically." },
  { icon: Clock, title: "60-Min Free Wait", desc: "Domestic flights get 60 minutes of complimentary wait time after landing." },
  { icon: MapPin, title: "Curbside & Meet & Greet", desc: "Choose curbside pickup or an in-terminal meet & greet with your name on a board." },
  { icon: CheckCircle, title: "Luggage Assistance", desc: "Your chauffeur will assist with your bags from the terminal to the vehicle." },
];

export default function AirportSection() {
  return (
    <section className="relative z-10 w-full bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={slideInLeft}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Airport transfers
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Smooth landings,
              <br />every time.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              Your driver is there when you land, no matter what. We track every flight and adapt
              in real-time so you never have to worry about your ride.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/#book"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              Book airport transfer
              <Plane className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={slideInRight}
          >
            <div className="relative h-80 w-full overflow-hidden rounded-2xl md:h-[26rem]">
              <Image
                src="/A welcome like no other.png"
                alt="A BlackDrivo chauffeur welcoming a passenger"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={70}
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
