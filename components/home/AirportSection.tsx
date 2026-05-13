"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plane, Clock, MapPin, CheckCircle } from "lucide-react";

const airports = [
  { code: "JFK", name: "John F. Kennedy International", location: "Queens, NY" },
  { code: "LGA", name: "LaGuardia Airport", location: "Queens, NY" },
  { code: "EWR", name: "Newark Liberty International", location: "Newark, NJ" },
  { code: "HPN", name: "Westchester County Airport", location: "White Plains, NY" },
  { code: "ISP", name: "Long Island MacArthur Airport", location: "Islip, NY" },
  { code: "TTN", name: "Trenton-Mercer Airport", location: "Trenton, NJ" },
];

const features = [
  { icon: Plane, title: "Live Flight Tracking", desc: "We monitor your flight in real-time. Delayed or early — your driver adjusts automatically." },
  { icon: Clock, title: "60-Min Free Wait", desc: "Domestic flights get 60 minutes of complimentary wait time after landing." },
  { icon: MapPin, title: "Curbside & Meet & Greet", desc: "Choose curbside pickup or an in-terminal meet & greet with your name on a board." },
  { icon: CheckCircle, title: "Luggage Assistance", desc: "Your chauffeur will assist with your bags from the terminal to the vehicle." },
];

export default function AirportSection() {
  return (
    <section className="w-full bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Airport transfers
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Smooth landings,
              <br />every time.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              Your driver is there when you land, no matter what. We track every flight and adapt
              in real-time so you never have to worry about your ride.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/booking?type=one_way"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              Book airport transfer
              <Plane className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div
                className="h-52 w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/A%20welcome%20like%20no%20other.png')" }}
              />
              <div className="p-6">
              <p className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Airports we serve
              </p>
              <div className="space-y-3">
                {airports.map((airport, i) => (
                  <motion.div
                    key={airport.code}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 transition hover:border-[#0b66d1]/30 hover:bg-blue-50/30"
                  >
                    <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-[#0b66d1] font-bold text-white text-sm">
                      {airport.code}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{airport.name}</p>
                      <p className="text-xs text-gray-500">{airport.location}</p>
                    </div>
                    <Plane className="ml-auto h-4 w-4 text-gray-300" />
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-sm font-medium text-[#0b66d1]">All US airports</p>
                <p className="mt-1 text-xs text-gray-500">
                  Don&apos;t see your airport? We serve all major US airports. Search your location when booking.
                </p>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
