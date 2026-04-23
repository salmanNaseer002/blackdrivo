"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  Headphones,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { excellenceCards, promisePoints } from "./data";

const excellenceItems = [
  {
    title: "Trusted chauffeurs",
    description: "Professional, discreet service with reliable pickups.",
    Icon: BadgeCheck,
  },
  {
    title: "Safety first",
    description: "Carefully vetted partners and clear trip details.",
    Icon: ShieldCheck,
  },
  {
    title: "24/7 support",
    description: "Help when you need it — before, during, and after your ride.",
    Icon: Headphones,
  },
];

export default function LowerSections() {
  const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
  };
  const revealUp = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  };
  const revealLeft = {
    hidden: { opacity: 0, x: -26 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  };
  const revealRight = {
    hidden: { opacity: 0, x: 26 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_OUT } },
  };

  return (
    <>
      <motion.section
        className="w-full bg-[#a8c6ea] px-6 py-12"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/60">
              We move with you
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-black/90 md:text-6xl">
              Book in seconds.
              <br />
              Manage every ride.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-black/75">
              Plan airport pickups, hourly service, and city-to-city rides with a unified
              booking experience designed for BlackDrivo customers across the United States.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                <Smartphone className="h-4 w-4" />
                App Store
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                <Smartphone className="h-4 w-4" />
                Google Play
              </button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/35 blur-2xl" />
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-black/15 blur-2xl" />
            <div className="relative rounded-2xl border border-black/10 bg-white/65 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-black/10 bg-white p-4">
                  <p className="text-xs font-medium text-black/50">Upcoming</p>
                  <p className="mt-2 text-lg font-semibold">JFK → Midtown</p>
                  <p className="mt-1 text-xs text-black/50">7:00 AM · Business</p>
                </div>
                <div className="rounded-xl border border-black/10 bg-white p-4">
                  <p className="text-xs font-medium text-black/50">Saved</p>
                  <p className="mt-2 text-lg font-semibold">LAX</p>
                  <p className="mt-1 text-xs text-black/50">Airport pickup</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-black/10 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Ride details</p>
                  <p className="text-xs font-medium text-black/50">US only</p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-black/60">
                  <div className="rounded-lg bg-black/5 px-3 py-2">Pickup</div>
                  <div className="rounded-lg bg-black/5 px-3 py-2">Drop-off</div>
                  <div className="rounded-lg bg-black/5 px-3 py-2">Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative w-full overflow-hidden bg-[#f6f5f1] px-6 pb-10 pt-20 text-center"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.35]">
          <div className="absolute left-1/2 top-4 h-28 w-28 -translate-x-1/2 rounded-full bg-[#a8c6ea] blur-3xl" />
        </div>
        <motion.p
          variants={revealUp}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-black/60"
        >
          Quiet luxury
        </motion.p>
        <motion.h2
          variants={revealUp}
          className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight text-black/90 md:text-7xl"
        >
          Step in. Breathe
          <br />
          out.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="mx-auto mt-5 max-w-3xl text-base leading-8 text-black/70 md:text-[18px] md:leading-9"
        >
          Thoughtful details and discreet service transform every journey into your personal
          sanctuary.
        </motion.p>
        <motion.div
          variants={revealUp}
          className="mx-auto mt-7 h-[2px] w-44 bg-gradient-to-r from-transparent via-black/25 to-transparent"
        />
      </motion.section>

      <motion.section
        className="w-full bg-[#f6f5f1] px-6 pb-16"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto grid w-full max-w-[1240px] gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            variants={revealLeft}
            className="relative min-h-[520px] overflow-hidden rounded-3xl"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=2400&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-black/35 px-6 py-5 text-white backdrop-blur">
              <p className="text-2xl font-semibold md:text-4xl">A welcome like no other</p>
              <p className="mt-2 text-sm leading-7 text-white/90 md:text-base">
                The door is opened for you. Luggage is handled. Everything is taken care of.
              </p>
            </div>
          </motion.div>
          <div className="grid gap-6">
            <motion.div
              variants={revealRight}
              className="relative min-h-[250px] overflow-hidden rounded-3xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2400&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-black/35 px-6 py-5 text-white backdrop-blur">
                <p className="text-xl font-semibold md:text-2xl">You set the tone</p>
                <p className="mt-1 text-sm text-white/90">
                  Music and temperature adjusted to your preferences.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={revealRight}
              className="relative min-h-[250px] overflow-hidden rounded-3xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1520975693411-b1cae85b0f4a?auto=format&fit=crop&w=2400&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-black/35 px-6 py-5 text-white backdrop-blur">
                <p className="text-xl font-semibold md:text-2xl">Recharge your batteries</p>
                <p className="mt-1 text-sm text-white/90">
                  Stay connected on the go with universal charging.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full bg-[#0f1723] px-6 py-16"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              BlackDrivo Promise
            </p>
            <h3 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Premium rides, done right.
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/80 md:text-base">
              Our mission is simple: make sure you receive fast, safe, and enjoyable ground
              transportation — every single time.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/85 md:text-base">
              {promisePoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#f6b73c]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#f6b73c] px-5 py-2.5 text-sm font-semibold text-black">
                Book a ride
              </button>
              <button className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
                Learn about service
              </button>
            </div>
          </div>
          <div
            className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(15,23,35,0.72), rgba(15,23,35,0.15)), url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=2400&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-white backdrop-blur">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#f6b73c]" />
                <p className="text-sm font-semibold">Business-ready</p>
              </div>
              <p className="mt-2 text-sm text-white/85">
                Corporate rides, airport transfers, and team travel — with a consistent premium
                experience.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative w-full bg-[#f6f5f1] px-6 pb-20 pt-16"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.45]">
          <div className="absolute left-10 top-14 h-40 w-40 rounded-full bg-[#a8c6ea] blur-3xl" />
          <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-[#f6b73c] blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-[1240px] text-center">
          <motion.h2 variants={revealUp} className="font-serif text-4xl tracking-tight md:text-7xl">
            Expect excellence.
          </motion.h2>
          <motion.p
            variants={revealUp}
            className="mx-auto mt-4 max-w-3xl text-base leading-8 text-black/70 md:text-xl"
          >
            Leave the car refreshed and ready for what&apos;s next.
          </motion.p>
        </div>

        <div className="relative mx-auto mt-10 grid w-full max-w-[1240px] gap-5 md:grid-cols-3">
          {excellenceItems.map(({ title, description, Icon }, idx) => (
            <motion.article
              key={title}
              variants={idx === 0 ? revealLeft : idx === 2 ? revealRight : revealUp}
              className="rounded-3xl border border-black/5 bg-white/85 px-6 py-8 shadow-sm backdrop-blur"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a8c6ea]">
                <Icon className="h-6 w-6 text-[#0f1723]" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-black/70 md:text-base">{description}</p>
            </motion.article>
          ))}
        </div>

        <div className="relative mx-auto mt-8 grid w-full max-w-[1240px] gap-5 md:grid-cols-3">
          {excellenceCards.map((card, idx) => (
            <motion.article
              key={card.title}
              variants={idx === 0 ? revealLeft : idx === 2 ? revealRight : revealUp}
              className="rounded-3xl bg-[#a7c4eb] px-6 py-10 text-center"
            >
              <p className="text-2xl font-semibold md:text-3xl">{card.title}</p>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-black/75 md:text-base">
                {card.subtitle}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>
    </>
  );
}
