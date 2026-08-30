"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

function getFeatures(region: "us" | "pk") {
  const driverWord = region === "pk" ? "driver" : "chauffeur";
  return [
    { title: "Live Flight Tracking", desc: "We monitor your flight in real-time. Delayed or early — your driver adjusts automatically." },
    { title: "60-Min Free Wait", desc: "Domestic flights get 60 minutes of complimentary wait time after landing." },
    { title: "Curbside & Meet & Greet", desc: "Choose curbside pickup or an in-terminal meet & greet with your name on a board." },
    { title: "Luggage Assistance", desc: `Your ${driverWord} will assist with your bags from the terminal to the vehicle.` },
  ];
}

export default function AirportSection({ region = "us" }: { region?: "us" | "pk" }) {
  const features = getFeatures(region);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const headingScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px]">
        {/* Image-cover banner — heading lives on top of the photo */}
        <motion.div
          ref={bannerRef}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative h-[26rem] w-full overflow-hidden rounded-3xl md:h-[32rem]"
        >
          <Image
            src="/A welcome like no other.png"
            alt={region === "pk" ? "A BlackDrivo driver welcoming a passenger" : "A BlackDrivo chauffeur welcoming a passenger"}
            fill
            sizes="100vw"
            quality={75}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-8 md:p-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
              Airport transfers
            </p>
            <motion.h2
              style={{ scale: headingScale, opacity: headingOpacity }}
              className="origin-bottom-left text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              Smooth landings,
              <br />every time.
            </motion.h2>
          </div>

          <Link
            href="/#book"
            className="group absolute bottom-8 right-8 inline-flex items-center gap-2 text-lg font-semibold text-white transition hover:gap-3 md:bottom-14 md:right-14 md:text-xl"
          >
            Book airport transfer
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Description */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 w-full text-center text-lg leading-8 text-gray-600 md:text-xl"
        >
          Your driver is there when you land, no matter what. We track every flight and adapt
          in real-time so you never have to worry about your ride.
        </motion.p>

        {/* Feature cards — icon-less, flat, shared hover backdrop like the Services cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-12 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="rounded-3xl p-6 transition-colors duration-300 hover:bg-blue-50"
            >
              <p className="text-base font-semibold text-gray-900">{f.title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
