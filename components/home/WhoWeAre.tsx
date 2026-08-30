"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "@/lib/animations";

function getPoints(region: "us" | "pk") {
  return [
    region === "pk" ? "Serving Lahore, Karachi & Islamabad" : "Serving New Jersey & Philadelphia",
    "Corporate, VIP & private travel",
    "Fixed-rate pricing — no surprises",
    "24/7 reservations and dispatch support",
  ];
}

export default function WhoWeAre({ region = "us" }: { region?: "us" | "pk" }) {
  const points = getPoints(region);
  const driverWord = region === "pk" ? "driver" : "chauffeur";
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });
  const headingScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <motion.h2
              ref={headingRef}
              style={{ scale: headingScale, opacity: headingOpacity }}
              className="origin-left text-5xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl"
            >
              Who We Are
            </motion.h2>
            <div className="mt-6 h-[3px] w-16 bg-[#0b66d1]" />
            <p className="mt-6 text-base leading-7 text-gray-600 md:text-lg">
              BlackDrivo was founded with a singular commitment: deliver world-class {driverWord}-driven
              transportation to {region === "pk" ? "Lahore, Karachi, and Islamabad" : "the tri-state area"} — the kind of service that executives,
              frequent travelers, and discerning individuals deserve on every ride.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              We are not simply a car service. We are a professional transportation team that
              understands what high-value clients expect: punctual {driverWord}s, immaculate vehicles,
              responsive communication, and a seamless booking process — from reservation
              to final drop-off.
            </p>
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="mt-9 grid gap-3 sm:grid-cols-2"
            >
              {points.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Image */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={scaleIn}
            className="relative"
          >
            <div className="relative h-80 overflow-hidden rounded-3xl md:h-[30rem]">
              <Image
                src="/about-VIVGzd.jpeg"
                alt="BlackDrivo premium fleet at luxury hotel"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
              <p className="text-3xl font-extrabold text-gray-900">99.8%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">On-Time Performance</p>
              <p className="mt-1 text-xs text-gray-500">Across all service categories</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
