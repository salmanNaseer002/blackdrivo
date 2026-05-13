"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior VP, Goldman Sachs",
    text: "BlackDrivo has completely transformed my business travel. The driver is always waiting when I land, the cars are immaculate, and the service is genuinely five-star. I won't use anything else.",
    rating: 5,
    location: "New York, NY",
  },
  {
    name: "Michael Torres",
    role: "Head of Operations, JPMorgan",
    text: "We use BlackDrivo for all our executive airport transfers across the tri-state area. Punctual, professional, and the billing integration saves our team hours every month.",
    rating: 5,
    location: "Newark, NJ",
  },
  {
    name: "Amanda Patel",
    role: "Event Director, Madison Events",
    text: "I coordinated 12 vehicles for a major gala through BlackDrivo. Every single driver arrived on time, looked professional, and provided exceptional service. Flawless execution.",
    rating: 5,
    location: "Jersey City, NJ",
  },
  {
    name: "David Kim",
    role: "Managing Partner, Apex Capital",
    text: "The hourly service is exactly what I needed for my NYC days. The driver anticipates your needs and the vehicles are always top-of-the-line. Worth every penny.",
    rating: 5,
    location: "Manhattan, NY",
  },
  {
    name: "Rachel Foster",
    role: "Partner, Sullivan & Cromwell LLP",
    text: "BlackDrivo for legal client transfers is outstanding. Confidentiality, punctuality, and a level of discretion that corporate law demands. Highly recommended.",
    rating: 5,
    location: "White Plains, NY",
  },
  {
    name: "James Wright",
    role: "CEO, Wright Technologies",
    text: "I've tried every premium car service in New York. BlackDrivo is in a different league. The app is easy, drivers are exceptional, and they've never once been late.",
    rating: 5,
    location: "Long Island, NY",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            Testimonials
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Trusted by professionals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Executives, legal professionals, and frequent travelers across the tri-state area trust BlackDrivo for every important journey.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="relative rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition hover:shadow-md"
            >
              <Quote className="absolute right-5 top-5 h-6 w-6 text-[#0b66d1]/20" />
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[#0b66d1] text-[#0b66d1]" />
                ))}
              </div>
              <p className="text-sm leading-6 text-gray-700">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0b66d1]">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-1 w-1 rounded-full bg-[#0b66d1]/60" />
                {t.location}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
