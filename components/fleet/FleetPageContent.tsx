"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import BookingWidget from "@/components/home/BookingWidget";

// ─── Fleet data (from Supabase `fleet_catalog_vehicles`, managed in Admin) ──

export interface FleetVehicle {
  id: string;
  country_code: string;
  section: string;
  category_label: string | null;
  vehicle_name: string;
  model: string | null;
  pax_capacity: string | null;
  luggage_capacity: string | null;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const SECTION_ORDER = [
  "Economy Sedan", "Executive Luxury Sedan", "Executive Luxury SUV",
  "Vans, Buses & Coaches", "Event Vehicles", "Specialty Vehicles",
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

// ─── Page content ───────────────────────────────────────────────────────────

export default function FleetPageContent({ vehicles }: { vehicles: FleetVehicle[] }) {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");

  const regionVehicles = vehicles.filter((v) =>
    isPk ? v.country_code === "PK" : v.country_code !== "PK"
  );

  const sectionNames = [...new Set(regionVehicles.map((v) => v.section))].sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a);
    const ib = SECTION_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const sections = sectionNames.map((title) => ({
    title,
    vehicles: regionVehicles.filter((v) => v.section === title).sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <>
      {/* ── Hero — fixed background, booking widget pinned at the bottom, ──
          same structure as ServiceDetailContent.tsx's header. id="book" is
          the scroll target every vehicle card's "BOOK NOW" anchors to. ──── */}
      <section id="book" className="relative flex min-h-screen w-full items-end">
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/BlackDrivo%20Main%20Page%20-%202403x1603.png"
            className="h-full w-full object-cover"
            src="/herobg.mp4"
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
          <h1 className="text-center text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
            Our Fleet
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-white/65 md:text-base">
            Every vehicle inspected before every trip. Every driver uniformed and vetted.
            Select your vehicle and book in minutes — fixed pricing, 24/7.
          </p>

          {/* Category quick-links */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {sections.map((cat) => (
              <a
                key={cat.title}
                href={`#${slugify(cat.title)}`}
                className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/60 transition hover:text-white"
              >
                {cat.title}
              </a>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-3">
            {[
              { value: `${regionVehicles.length}+`, label: "Vehicle Classes" },
              { value: "24/7", label: "Always Available" },
              { value: "4.9★", label: "Average Rating" },
            ].map((s) => (
              <div key={s.label} className="bg-black/30 px-6 py-4 text-center backdrop-blur-sm">
                <p className="text-lg font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-6xl shadow-2xl shadow-black/40 md:mt-10">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* ── Fleet grid by section — relative z-10 required: the hero above is
          `fixed`, so this needs to be explicitly stacked above it. ────────── */}
      {sections.map((cat) => (
        <section
          key={cat.title}
          id={slugify(cat.title)}
          className="relative z-10 border-t border-gray-100 bg-white px-4 py-16 md:px-6 lg:px-8"
        >
          <div className="mx-auto w-full">
            <h2 className="mb-10 text-3xl font-bold text-gray-900 md:text-4xl">
              {cat.title}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.vehicles.map((v) => (
                <article
                  key={v.id}
                  className="group rounded-[2rem] p-3 transition-colors duration-300 hover:bg-blue-50"
                >
                  {/* Vehicle image */}
                  <div className="relative h-64 overflow-hidden rounded-2xl bg-gray-100 md:h-72">
                    <Image
                      src={v.image_url || "/placeholder.jpg"}
                      alt={v.vehicle_name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {v.is_featured && (
                      <span className="absolute right-3 top-3 rounded-full bg-[#0b66d1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-6 p-6">
                    {v.category_label && (
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0b66d1]">
                        {v.category_label}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-gray-900">
                      {v.vehicle_name}
                    </h3>

                    {/* Specs chips */}
                    {(v.pax_capacity || v.luggage_capacity) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {v.pax_capacity && (
                          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                            <Users className="h-3 w-3" />
                            {v.pax_capacity}
                          </span>
                        )}
                        {v.luggage_capacity && (
                          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                            <Briefcase className="h-3 w-3" />
                            {v.luggage_capacity}
                          </span>
                        )}
                      </div>
                    )}

                    {v.description && (
                      <p className="mt-3 text-sm leading-6 text-gray-500">
                        {v.description}
                      </p>
                    )}

                    {/* Book now — scrolls back up to the hero's booking widget,
                        rather than navigating away. */}
                    <a
                      href="#book"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
                    >
                      Book Now <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {sections.length === 0 && (
        <section className="relative z-10 border-t border-gray-100 bg-white px-4 py-24 text-center md:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            Our {isPk ? "Pakistan" : "US"} fleet listing is being updated — check back shortly, or use the booking form above to book instantly.
          </p>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-gray-100 bg-gray-950 px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Need help choosing?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/50">
            Our team is available 24/7 to help you select the perfect vehicle for your journey.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#book"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={isPk ? "tel:+923052222744" : "tel:+18005550199"}
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
            >
              Call 24/7
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
