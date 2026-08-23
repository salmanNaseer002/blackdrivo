"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import BusinessInquiryForm from "./BusinessInquiryForm";
import type { AccountType } from "@/validations/query";

type Point = { title: string; desc: string };

export default function BusinessSubPageContent({
  title,
  intro,
  heroImage,
  points,
  ctaLabel,
  accountType,
}: {
  title: string;
  intro: string;
  heroImage: string;
  points: Point[];
  ctaLabel: string;
  accountType: AccountType;
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen w-full items-end">
        <div className="fixed inset-0 z-0">
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(10,15,26,0.35) 0%, rgba(10,15,26,0.65) 55%, rgba(10,15,26,0.9) 100%)",
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t from-white to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pb-20 pt-24 text-center md:px-6 md:pb-24 lg:px-8"
        >
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
            {intro}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#business-form"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Points */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {points.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="group rounded-[2rem] p-6 transition-colors duration-300 hover:bg-blue-50"
              >
                <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 flex min-h-screen w-full items-center justify-center bg-gray-950 px-4 py-16 text-center md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto w-full"
        >
          <h2 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Let&apos;s talk about your business.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/50 md:text-base">
            Our business team will help you find the right fit — no obligation, no pressure.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#business-form"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Call 24/7
            </a>
          </div>
        </motion.div>
      </section>

      <BusinessInquiryForm accountType={accountType} />
    </>
  );
}
