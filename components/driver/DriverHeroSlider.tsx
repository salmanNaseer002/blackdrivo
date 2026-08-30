"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/driver-slide-1.webp",
    alt: "BlackDrivo professional driver",
    position: "object-center",
  },
  {
    src: "/driver-slide-2.webp",
    alt: "BlackDrivo luxury executive vehicle",
    position: "object-center",
  },
  {
    src: "/driver-slide-3.webp",
    alt: "BlackDrivo premium driver service",
    position: "object-center",
  },
  {
    src: "/driver-slide-4.webp",
    alt: "BlackDrivo elite fleet",
    position: "object-center",
  },
];

export default function DriverHeroSlider() {
  const [current, setCurrent]  = useState(0);
  const [fading,  setFading]   = useState(false);
  const intervalRef            = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (idx === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 350);
  };

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        setFading(true);
        setTimeout(() => setFading(false), 350);
        return (prev + 1) % slides.length;
      });
    }, 3000);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-[350ms]"
          style={{ opacity: i === current ? (fading ? 0 : 1) : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className={`object-cover ${slide.position}`}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay — gradient bottom-heavy so text pops */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,12,22,0.30) 0%, rgba(8,12,22,0.55) 40%, rgba(8,12,22,0.90) 78%, rgba(8,12,22,1) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-1 flex-col justify-end">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 md:px-8 md:pb-16">

          {/* Heading */}
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] text-white md:text-7xl">
            Become a BlackDrivo Service Provider
          </h1>

          {/* Gold-style rule */}
          <div className="mt-5 h-[3px] w-36 bg-[#0b66d1]" />

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Grow your business with a premium mobility partner built for quality, reliability,
            and long-term partnerships.
          </p>

          {/* Slide dots */}
          <div className="mt-8 flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-[3px] transition-all duration-300 ${
                  i === current ? "w-8 bg-[#0b66d1]" : "w-4 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Banner bar — merged into the hero */}
        <div className="relative z-20 border-t border-white/10 bg-[#0b66d1]">
          <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:flex-row sm:text-left md:px-8">
            <p className="max-w-2xl text-sm font-medium leading-6 text-white md:text-base">
              Join BlackDrivo with a simple onboarding process and dedicated support to help you
              get started smoothly.
            </p>
            <Link
              href="#"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0b66d1] transition hover:gap-3 hover:bg-gray-100"
            >
              Become a Partner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
