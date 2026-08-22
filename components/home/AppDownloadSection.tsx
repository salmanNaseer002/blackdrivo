"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Star, MapPin, Bell, ShieldCheck, Car, Navigation, Route, Map } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fadeUp, slideInLeft, viewportOnce } from "@/lib/animations";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.15 1.94-.83 3.28-.78 1.35.06 2.39.62 3.09 1.66-2.87 1.71-2.29 5.49.41 6.55-.51 1.34-1.19 2.66-1.86 4.74zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.36 4.51-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3.6 2.3c-.36.36-.6.9-.6 1.6v16.2c0 .7.24 1.24.6 1.6l.1.08L13 12.4v-.2L3.7 2.22l-.1.08z" />
      <path d="M16.2 15.6l-3.2-3.2v-.2l3.2-3.2 3.9 2.22c.98.55.98 1.6 0 2.16l-3.9 2.22z" />
      <path d="M13 12.2L3.6 21.7c.34.36.9.4 1.53.06l10.98-6.24-3.11-3.32z" />
      <path d="M13 12v.2l3.2 3.18 3.11-3.32-2.9-1.66L13 12z" />
    </svg>
  );
}

const DEFAULT_HIGHLIGHTS = [
  "Live tracking on every ride",
  "Instant booking notifications",
  "Secure, cashless payments",
];
const HIGHLIGHT_ICONS = [MapPin, Bell, ShieldCheck];

// Floating ride-hailing icons, kept to the edges so they never sit behind the phone mockup
const FLOATERS = [
  { Icon: Car,        top: "6%",  left: "4%",  size: 28, dur: 3.4, delay: 0 },
  { Icon: Navigation, top: "10%", left: "84%", size: 22, dur: 4,   delay: 0.3 },
  { Icon: MapPin,     top: "60%", left: "90%", size: 24, dur: 3,   delay: 0.6 },
  { Icon: Route,      top: "88%", left: "6%",  size: 26, dur: 4.2, delay: 0.15 },
  { Icon: Car,        top: "38%", left: "94%", size: 20, dur: 3.6, delay: 0.7 },
  { Icon: Navigation, top: "46%", left: "0%",  size: 20, dur: 2.8, delay: 0.45 },
  { Icon: Map,        top: "2%",  left: "44%", size: 22, dur: 3.8, delay: 0.85 },
  { Icon: Car,        top: "92%", left: "50%", size: 22, dur: 3.2, delay: 0.25 },
  { Icon: MapPin,     top: "20%", left: "8%",  size: 18, dur: 3.5, delay: 1 },
  { Icon: Car,        top: "78%", left: "88%", size: 20, dur: 3,   delay: 0.55 },
];

// Gen-Z style floating comment bubbles — pinned to the corners, clear of the phone
const COMMENTS = [
  { text: "this app hits different 🔥",   top: "8%",  left: "0%",  dur: 4,   delay: 0.2,  rotate: -4 },
  { text: "no cap, best ride ever 💯",     top: "70%", left: "2%",  dur: 4.6, delay: 0.6,  rotate: 3 },
  { text: "bestie you NEED this app",      top: "16%", left: "62%", dur: 3.8, delay: 0.1,  rotate: 4 },
  { text: "driver was on time... shook 😭", top: "86%", left: "58%", dur: 5,   delay: 0.9,  rotate: -3 },
  { text: "it's giving premium fr fr ✨",   top: "0%",  left: "58%", dur: 4.2, delay: 0.4,  rotate: -2 },
];

interface AppDownloadData {
  kicker: string;
  heading_line1: string;
  heading_line2: string;
  description: string;
  highlights: string[];
  rating_enabled: boolean;
  rating_text: string;
  image_url: string | null;
  app_store_url: string | null;
  google_play_url: string | null;
}

export default function AppDownloadSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.4 });

  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [42, 0, -42]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [10, 0, -10]);
  const translateY = useTransform(smoothProgress, [0, 0.5, 1], [70, 0, -70]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.88, 1.04, 0.88]);

  // Icon/comment layer drifts faster than the phone for a parallax feel
  const layerY = useTransform(smoothProgress, [0, 1], [120, -120]);
  const layerX = useTransform(smoothProgress, [0, 1], [-30, 30]);

  const [data, setData] = useState<AppDownloadData | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: row } = await (supabase as any)
        .from("web_app_download")
        .select("*")
        .limit(1)
        .maybeSingle();
      setData(row || null);
    };
    load();
  }, []);

  const kicker = data?.kicker || "Get the app";
  const heading1 = data?.heading_line1 || "BlackDrivo,";
  const heading2 = data?.heading_line2 || "now in your pocket.";
  const description =
    data?.description ||
    "Book, track, and manage your premium rides from anywhere. Available for iOS and Android.";
  const highlights =
    data?.highlights && data.highlights.length > 0 ? data.highlights : DEFAULT_HIGHLIGHTS;
  const ratingEnabled = data?.rating_enabled ?? true;
  const ratingText = data?.rating_text || "4.9 average rating · 50,000+ rides booked";
  const imageUrl = data?.image_url || null;
  const appStoreUrl = data?.app_store_url || "#";
  const googlePlayUrl = data?.google_play_url || "#";

  return (
    <section
      ref={ref}
      className="relative z-10 w-full overflow-hidden rounded-t-[2.5rem] bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28"
    >
      {/* Floating ride-hailing icons + comments — kept to the phone's half only, drift with scroll for parallax */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 lg:block"
        style={{ y: layerY, x: layerX }}
      >
        {/* Animated dashed route polyline */}
        <svg
          className="absolute inset-0 h-full w-full text-[#0b66d1]/40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d="M 8 20 Q 25 5, 40 30 T 65 15 Q 80 30, 92 12"
            vectorEffect="non-scaling-stroke"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeDasharray="1 6"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -140 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 10 85 Q 30 70, 48 90 T 78 75 Q 88 88, 95 70"
            vectorEffect="non-scaling-stroke"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeDasharray="1 6"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -140 }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </svg>

        {FLOATERS.map((f, i) => (
          <motion.div
            key={i}
            className="absolute text-[#0b66d1]/45"
            style={{ top: f.top, left: f.left }}
            animate={{ y: [0, -18, 0], x: [0, 10, 0], rotate: [0, 6, 0] }}
            transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          >
            <f.Icon style={{ width: f.size, height: f.size }} />
          </motion.div>
        ))}

        {COMMENTS.map((c, i) => (
          <motion.div
            key={i}
            className="absolute whitespace-nowrap rounded-2xl border border-gray-100 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-md"
            style={{ top: c.top, left: c.left, rotate: c.rotate }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
          >
            {c.text}
          </motion.div>
        ))}
      </motion.div>

      <div className="relative mx-auto grid max-w-[1600px] items-center gap-14 lg:grid-cols-2">
        {/* Left — copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={slideInLeft}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            {kicker}
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {heading1}
            <br />
            {heading2}
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-gray-600 md:text-lg">
            {description}
          </p>

          <div className="mt-7 space-y-3">
            {highlights.map((text, i) => {
              const Icon = HIGHLIGHT_ICONS[i] || MapPin;
              return (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-gray-600">{text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-black px-5 py-3 transition hover:border-gray-400"
            >
              <AppleIcon className="h-7 w-7 text-white" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-white/60">Download on the</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
            </a>
            <a
              href={googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-black px-5 py-3 transition hover:border-gray-400"
            >
              <PlayIcon className="h-6 w-6 text-white" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-white/60">Get it on</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
            </a>
          </div>

          {ratingEnabled && (
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <div className="flex text-[#f5a623]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              {ratingText}
            </div>
          )}
        </motion.div>

        {/* Right — 3D phone mockup */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative mx-auto flex justify-center"
          style={{ perspective: 1400 }}
        >
          <motion.div
            style={{ rotateY, rotateX, y: translateY, scale, transformStyle: "preserve-3d" }}
            className="relative w-[260px] sm:w-[300px]"
          >
            {/* Glow */}
            <div className="absolute inset-0 -z-10 scale-90 rounded-[3rem] bg-[#0b66d1]/15 blur-3xl" />

            {/* Phone frame */}
            <div
              className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-950 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)]"
              style={{ transform: "translateZ(40px)" }}
            >
              {/* Notch */}
              <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-gray-950" />

              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="BlackDrivo app" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col bg-gradient-to-b from-[#0b1f3a] to-[#0b66d1] px-4 pb-6 pt-9 text-white">
                  <p className="text-xs text-white/50">Good evening</p>
                  <p className="text-lg font-bold">Where to?</p>

                  <div className="mt-4 rounded-xl bg-white/10 px-3 py-2.5 text-xs text-white/70 backdrop-blur">
                    Search pickup location
                  </div>

                  <div className="mt-4 flex-1 rounded-2xl bg-white/95 p-3 text-gray-900 shadow-lg">
                    <p className="text-[11px] font-semibold text-gray-500">Your ride</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0b66d1]">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold">JFK Airport</p>
                        <p className="text-[10px] text-gray-400">Arriving in 4 min</p>
                      </div>
                    </div>
                    <div className="mt-3 h-16 rounded-xl bg-gray-100" />
                  </div>

                  <div className="mt-4 rounded-full bg-white py-2.5 text-center text-xs font-semibold text-[#0b66d1]">
                    Book Your Ride
                  </div>
                </div>
              )}
            </div>

            {/* Floating accent cards for depth */}
            <motion.div
              style={{ transform: "translateZ(70px) translateX(-30px)" }}
              className="absolute -left-6 top-10 hidden rounded-xl bg-white p-3 shadow-xl sm:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                <span className="text-[10px] font-semibold text-gray-700">Trip secured</span>
              </div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(70px) translateX(30px)" }}
              className="absolute -right-8 bottom-16 hidden rounded-xl bg-white p-3 shadow-xl sm:block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#0b66d1]" />
                <span className="text-[10px] font-semibold text-gray-700">Driver arriving</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
