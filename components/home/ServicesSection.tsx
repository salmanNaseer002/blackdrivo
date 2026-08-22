"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

const services = [
  {
    title: "Airport Transfers",
    description: "Never watch the arrivals board alone. We track your flight and adjust the moment it does.",
    href: "/services#airport",
    image: "/Departure 2.png",
  },
  {
    title: "Hourly Chauffeur",
    description: "Keep your driver on standby for the whole day. Move at your own pace, not the clock's.",
    href: "/services#hourly",
    image: "/Hourly Image.png",
  },
  {
    title: "City-to-City Rides",
    description: "Turn long-distance journeys into time well spent. Arrive refreshed, not stressed.",
    href: "/services#city",
    image: "/suv-2.jpg",
  },
  {
    title: "Corporate Travel",
    description: "Give your team a ride they can count on every time. One bill, zero hassle.",
    href: "/services#corporate",
    image: "/Exterior-with-door-open.jpg",
  },
];

const PAGE_SIZE = 2;
const PAGE_COUNT = Math.ceil(services.length / PAGE_SIZE);

export default function ServicesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });
  // Text is already at its normal size once it's on screen — only past the
  // midpoint (as the section keeps scrolling up and out) does it start shrinking.
  const headingScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.6]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5, 1], [0, 1, 1, 0.5]);

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (next: number) => {
    setDirection(next > page ? 1 : -1);
    setPage((next + PAGE_COUNT) % PAGE_COUNT);
  };

  const visible = services.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px]">
        <div ref={headingRef} className="mb-16 flex flex-col items-center text-center">
          <motion.h2
            style={{ scale: headingScale, opacity: headingOpacity }}
            className="text-6xl font-bold tracking-tight text-gray-900 md:text-7xl lg:text-8xl"
          >
            Every ride, a premium experience
          </motion.h2>
        </div>

        {/* Card pair — carousel, 2 of 4 services at a time */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {visible.map((service) => (
                <article
                  key={service.title}
                  className="group rounded-[2rem] p-3 transition-colors duration-300 hover:bg-blue-50"
                >
                  <div className="relative h-80 overflow-hidden rounded-2xl bg-gray-100 md:h-96">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-6 p-6">
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-500">{service.description}</p>
                    <Link
                      href={service.href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
                    >
                      Learn more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Prev / next — both circular, both nested inside one shared pill — Gen-Z carousel control */}
        {PAGE_COUNT > 1 && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mt-8 flex items-center justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1.5">
              <button
                onClick={() => goTo(page - 1)}
                aria-label="Previous"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-[#0b66d1] hover:text-white active:scale-90"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1.5 px-1">
                {Array.from({ length: PAGE_COUNT }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-[#0b66d1]" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo(page + 1)}
                aria-label="Next"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-[#0b66d1] hover:text-white active:scale-90"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
