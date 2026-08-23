"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Car } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { services } from "@/lib/services/data";
import BookingWidget from "@/components/home/BookingWidget";

const vehicleClasses = [
  {
    name: "Luxury Sedan",
    seats: 3,
    bags: 2,
    examples: "Mercedes S-Class, Lincoln Continental, Volvo S90",
    description: "Top-tier luxury for VIP clients, corporate, and airport transfers.",
  },
  {
    name: "Chauffeured SUV",
    seats: 6,
    bags: 5,
    examples: "Cadillac Escalade, Chevrolet Suburban, Mercedes GLS",
    description: "Premium SUVs for groups, families, and extra luggage capacity.",
  },
  {
    name: "Stretch Limousine",
    seats: 10,
    bags: 7,
    examples: "Stretch Limousine, SUV Stretch Limousine",
    description: "Classic luxury for weddings, proms, and unforgettable nights out.",
  },
  {
    name: "Executive Van & Coach",
    seats: 55,
    bags: 20,
    examples: "Mercedes Sprinter, Mini Bus, Motor Coach",
    description: "Large vans and coaches for groups, airport runs, and events.",
  },
];

export default function ServicesPageContent() {
  return (
    <>
      {/* Hero — same structure as the homepage Hero: fixed background photo, content pinned to the bottom */}
      <section id="book" className="relative flex min-h-screen w-full items-end">
        <div className="fixed inset-0 z-0">
          <Image
            src="/Exterior-with-door-open.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(10,15,26,0.28) 0%, rgba(10,15,26,0.58) 55%, rgba(10,15,26,0.88) 100%)",
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1800px] px-4 pb-8 pt-24 md:px-6 md:pb-16 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="text-center text-white"
          >
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Our Services
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
              At BlackDrivo, the client always comes first. Our focus on customer service and client
              satisfaction guarantees a professional, pleasurable ride in cities across the globe.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mx-auto mt-10 max-w-6xl shadow-2xl shadow-black/40 md:mt-10"
          >
            <BookingWidget />
          </motion.div>
        </div>
      </section>

      {/* Service grid */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-14 text-center"
          >
            <p className="mx-auto max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
              Whether you are traveling for business or leisure, our chauffeurs will provide the
              ultimate relaxing experience in the safety and comfort of our top-of-the-line vehicles.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service, i) => (
              <motion.article
                key={service.id}
                id={service.id}
                variants={fadeUp}
                className="group rounded-[2rem] p-3 transition-colors duration-300 hover:bg-blue-50"
              >
                <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 md:h-72">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                  />
                </div>
                <div className="mt-6 p-6">
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{service.tagline}</p>
                  <Link
                    href={`/services/${service.id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vehicle Classes */}
      <section className="relative z-10 flex min-h-screen w-full items-center bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold text-gray-900 md:text-6xl lg:text-7xl">
              Vehicle Classes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 md:text-base">
              Clients select their preferred class during reservation. We guarantee the exact category
              requested, maintained to pristine showroom standards.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {vehicleClasses.map((v, i) => (
              <motion.div
                key={v.name}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-3xl bg-white p-6 transition hover:bg-gray-100"
              >
                <div
                  className="animate-float-slow pointer-events-none absolute -bottom-4 -right-4 text-gray-900/[0.04]"
                  style={{ animationDelay: `${i * 0.25}s` }}
                >
                  <Car className="h-24 w-24" strokeWidth={0.75} />
                </div>
                <div className="relative">
                  <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-gray-500">{v.description}</p>
                  <div className="mt-4 space-y-1 text-xs text-gray-500">
                    <p>Up to {v.seats} passengers</p>
                    <p>{v.bags} bags</p>
                  </div>
                  <p className="mt-3 text-xs text-gray-400">{v.examples}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mt-10 text-center"
          >
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0b66d1]"
            >
              View Full Fleet <ArrowRight className="h-4 w-4" />
            </Link>
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3b8ff0]">
            Ready to Ride?
          </p>
          <h2 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Book your chauffeur today.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/50 md:text-base">
            Available 24 hours a day, 7 days a week, 365 days a year. Wherever you need to go,
            BlackDrivo will be there.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#book"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:gap-3 hover:bg-[#0952a8]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Call 24/7
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
