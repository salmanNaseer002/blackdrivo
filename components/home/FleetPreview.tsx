"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

const serviceAreas = [
  { city: "New York City", state: "NY", href: "/chauffeur-service/new-york-city" },
  { city: "New Jersey",    state: "NJ", href: "/chauffeur-service/newark"         },
  { city: "Philadelphia",  state: "PA", href: "/chauffeur-service/philadelphia"   },
];

export default function FleetPreview() {
  return (
    <>
      {/* ── Fleet Showcase ─────────────────────────────────────────── */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <Image
              src="/limo-1.jpg"
              alt="BlackDrivo Fleet"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Our Fleet</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              BlackDrivo<br />Large Fleet
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-600">
              From sporting events to corporate parties, seaport or airport transfers —
              we are here to serve you. To get a free quote or make a reservation,
              contact our chauffeur service.
            </p>
            <a
              href="tel:+18005550199"
              className="mt-7 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#0b66d1]"
            >
              <Phone className="h-4 w-4" />
              TOLL-FREE CALL 1 (800) 555-0199 24/7
            </a>
            <Link
              href="/booking"
              className="mt-3 inline-flex items-center gap-2 border-b border-[#0b66d1] pb-0.5 text-sm font-bold uppercase tracking-widest text-[#0b66d1] transition hover:gap-3"
            >
              MAKE A RESERVATION <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="mt-8">
              <Link
                href="/fleet"
                className="inline-flex items-center gap-2 bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b66d1]"
              >
                View Full Fleet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Service Areas ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-['Georgia',serif] text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Areas We<br />Serve
            </h2>
            <div className="mt-8 flex flex-col gap-4">
              {serviceAreas.map((area) => (
                <Link
                  key={area.city}
                  href={area.href}
                  className="flex items-center gap-3 text-base font-semibold text-[#0b66d1] transition hover:underline"
                >
                  <span className="inline-block w-8 text-center rounded bg-[#0b66d1]/10 px-1.5 py-0.5 text-xs font-bold text-[#0b66d1]">{area.state}</span>
                  {area.city}
                </Link>
              ))}
            </div>
            <Link
              href="/booking"
              className="mt-8 inline-flex items-center gap-2 border-b border-gray-900 pb-0.5 text-sm font-bold uppercase tracking-widest text-gray-900 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
            >
              MAKE A RESERVATION <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <Image
                src="/suv-2.jpg"
                alt="Cadillac Escalade"
                width={600}
                height={400}
                className="h-auto w-full object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Always There For You ───────────────────────────────────── */}
      <section className="relative flex min-h-80 items-center overflow-hidden">
        <Image
          src="/Exterior-with-door-open.jpg"
          alt="Professional Chauffeur Service"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/72" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 text-center md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
              Premium Chauffeur Service
            </p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Always There For You.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">
              Professional chauffeurs available 24 hours a day, 7 days a week, 365 days a year.
              Wherever you need to go, BlackDrivo will be there.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
              >
                Book Your Ride <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+18005550199"
                className="inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
              >
                <Phone className="h-4 w-4" /> Call 24/7
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
