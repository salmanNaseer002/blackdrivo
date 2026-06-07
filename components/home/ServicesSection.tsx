"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plane, Clock, MapPin, Briefcase, Star, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Flight-tracked pickups with 60 minutes of complimentary wait time. Available at JFK, LaGuardia, Newark, and all major airports.",
    features: ["Live flight monitoring", "Meet & greet available", "Luggage assistance"],
    href: "/services#airport",
    image: "/Departure 2.png",
  },
  {
    icon: Clock,
    title: "Hourly Chauffeur",
    description:
      "Reserve a dedicated chauffeur from 2 to 24 hours. Your driver stays on standby, ready to move whenever you are.",
    features: ["2–24 hour blocks", "Multiple stops", "Flexible schedule"],
    href: "/services#hourly",
    image: "/Hourly Image.png",
  },
  {
    icon: MapPin,
    title: "City-to-City Rides",
    description:
      "Premium transfers between cities. NY to DC, NYC to Boston, and any intercity route — arrive refreshed.",
    features: ["Fixed pricing", "No traffic stress", "Comfortable vehicles"],
    href: "/services#city",
    image: "/suv-2.jpg",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description:
      "Streamline your company's ground transportation with centralized billing and priority support.",
    features: ["Centralized billing", "Team accounts", "Priority support"],
    href: "/services#corporate",
    image: "/Exterior-with-door-open.jpg",
  },
  {
    icon: Star,
    title: "Event Transportation",
    description:
      "Arrive in style at weddings, galas, concerts, and special occasions. Every moment, handled perfectly.",
    features: ["Wedding packages", "Group coordination", "Red carpet service"],
    href: "/services#events",
    image: "/klein-28.jpg",
  },
];

export default function ServicesSection() {
  const [featured, ...rest] = services;

  return (
    <section className="w-full bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#0b66d1]">
              What we offer
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Every ride, a premium
              <br className="hidden sm:block" /> experience
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
          >
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Featured service — full-width split */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group mb-5 grid overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg lg:grid-cols-2"
        >
          <div className="relative h-64 overflow-hidden lg:h-auto">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          </div>
          <div className="flex flex-col justify-center bg-white p-8 lg:p-12">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
              <featured.icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{featured.title}</h3>
            <p className="mt-3 text-base leading-7 text-gray-600">{featured.description}</p>
            <ul className="mt-5 space-y-2">
              {featured.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0b66d1]" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={featured.href}
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.article>

        {/* Remaining services — 4-column grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <service.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-gray-500">{service.description}</p>
                <Link
                  href={service.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0b66d1] transition hover:gap-2"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
