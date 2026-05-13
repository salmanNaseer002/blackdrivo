"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plane, Clock, MapPin, Briefcase, Star, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Flight-tracked pickups with 60 minutes of complimentary wait time. Available at JFK, LaGuardia, Newark, and all major airports.",
    features: ["Flight monitoring", "Meet & greet", "Luggage assistance"],
    href: "/services#airport",
    image: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=800&q=80",
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
      "Premium transfers between cities. NY to DC, NYC to Boston, and any intercity route — arrive refreshed and on time.",
    features: ["Fixed pricing", "No traffic stress", "Comfortable vehicles"],
    href: "/services#city",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Briefcase,
    title: "Corporate Travel",
    description:
      "Streamline your company's ground transportation. Centralized billing, travel management, and consistent premium service.",
    features: ["Centralized billing", "Team accounts", "Priority support"],
    href: "/services#corporate",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
  {
    icon: Star,
    title: "Event Transportation",
    description:
      "Arrive in style at weddings, galas, concerts, and special occasions. Professional chauffeurs for every memorable moment.",
    features: ["Wedding packages", "Group coordination", "Red carpet service"],
    href: "/services#events",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ServicesSection() {
  return (
    <section className="w-full bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            What we offer
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Every ride, a premium experience
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
            From quick airport runs to multi-day corporate travel, BlackDrivo has a service designed for every need.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition ${
                i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div
                className="h-44 w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${service.image}')` }}
              >
                <div className="h-full w-full bg-gradient-to-b from-transparent to-white/10" />
              </div>
              <div className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{service.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0b66d1]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0b66d1] transition hover:gap-2.5"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-8 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
