"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/driver-slide-1.webp",
    alt: "BlackDrivo professional chauffeur",
    position: "object-center",
  },
  {
    src: "/driver-slide-2.webp",
    alt: "BlackDrivo luxury executive vehicle",
    position: "object-center",
  },
  {
    src: "/driver-slide-3.webp",
    alt: "BlackDrivo premium chauffeur service",
    position: "object-center",
  },
  {
    src: "/driver-slide-4.webp",
    alt: "BlackDrivo elite fleet",
    position: "object-center",
  },
];

const stats = [
  { value: "24/7",  label: "Dispatch Support"   },
  { value: "4.9★",  label: "Driver Rating"       },
  { value: "3",     label: "States Served"       },
  { value: "100%",  label: "Tips Yours to Keep"  },
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
      className="relative flex min-h-[88vh] flex-col overflow-hidden"
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
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8 md:pb-16">

          {/* Badge */}
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#0b66d1]">
            the blackdrivo standard
          </p>

          {/* Heading */}
          <h1 className="font-['Georgia',serif] text-5xl font-bold leading-[1.08] text-white md:text-7xl">
            Elevate Your Career.<br />
            Drive with BlackDrivo.
          </h1>

          {/* Gold-style rule */}
          <div className="mt-5 h-[3px] w-36 bg-[#0b66d1]" />

          {/* Description */}
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Leave the ordinary behind and step into a career that respects your professionalism.
            Gain access to premium clientele, consistent high-end volume, and 24/7 dispatch support
            across NYC, New Jersey, and Philadelphia.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/driver/signup"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-9 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#0952a8]"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 border border-white/35 px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:border-white hover:bg-white/5"
            >
              Explore Career Paths
            </a>
          </div>

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

        {/* Stats bar */}
        <div className="relative z-20 grid grid-cols-2 border-t border-white/10 bg-black/60 backdrop-blur-sm sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-r border-white/10 px-6 py-5 last:border-r-0">
              <p className="text-xl font-extrabold text-white">{s.value}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
