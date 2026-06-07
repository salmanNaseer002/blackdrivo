import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet | Luxury Black Car & Chauffeur Vehicles — BlackDrivo",
  description:
    "Explore BlackDrivo's premium fleet: executive sedans, luxury SUVs, Mercedes Sprinter limos, stretch limousines, vintage classics, and motor coaches. Book yours today.",
  keywords:
    "luxury fleet, black car service, executive sedan, Cadillac Escalade, Chevrolet Suburban, Mercedes Sprinter, stretch limousine, chauffeur vehicles NYC NJ Philadelphia",
};

// ─── Fleet data ───────────────────────────────────────────────────────────────

interface FleetVehicle {
  id: string;
  name: string;
  categoryLabel: string;
  passengers: string;
  bags: string;
  image: string;
  description: string;
  featured?: boolean;
}

interface FleetCategory {
  title: string;
  vehicles: FleetVehicle[];
}

const fleetCategories: FleetCategory[] = [
  {
    title: "Executive Luxury Sedan",
    vehicles: [
      {
        id: "s580",
        name: "Mercedes-Benz S580",
        categoryLabel: "EXECUTIVE LUXURY SEDAN",
        passengers: "4 Passengers",
        bags: "2X Suitcases | 3X Carry-on bags",
        image: "/image-76.webp",
        description:
          "Experience first-class comfort in the Mercedes-Benz S580. With a quiet cabin, refined presence, and executive-level privacy, this flagship luxury sedan is ideal for VIP pickups, corporate transfers, airport travel, and private chauffeur service.",
      },
      {
        id: "lincoln",
        name: "Lincoln Continental",
        categoryLabel: "EXECUTIVE LUXURY SEDAN",
        passengers: "4 Passengers",
        bags: "2x Suitcases / 3x Carry-ons",
        image: "/image-79.webp",
        description:
          "Experience quiet executive comfort in the Lincoln Continental. With generous rear-seat space, a smooth ride, and a refined cabin, this luxury sedan is ideal for airport transfers, corporate travel, roadshows, and VIP transportation.",
      },
      {
        id: "volvo",
        name: "Volvo S90",
        categoryLabel: "EXECUTIVE LUXURY SEDAN",
        passengers: "4 Passengers",
        bags: "2x Suitcases / 3x Carry-ons",
        image: "/image-83.webp",
        description:
          "Experience understated luxury in the Volvo S90. With a quiet cabin, refined Scandinavian design, and executive-level comfort, this sedan is ideal for airport transfers, corporate travel, VIP service, and private city transportation.",
      },
    ],
  },
  {
    title: "Executive Luxury SUV",
    vehicles: [
      {
        id: "escalade",
        name: "Cadillac Escalade",
        categoryLabel: "EXECUTIVE LUXURY SUV",
        passengers: "6–7 Passengers",
        bags: "5–6 standard suitcases",
        image: "/suv-2.jpg",
        featured: true,
        description:
          "Travel in elevated comfort with the Cadillac Escalade. With commanding luxury, spacious three-row seating, and generous luggage capacity, this premium SUV is ideal for VIP groups, airport transfers, private aviation pickups, and executive travel.",
      },
      {
        id: "suburban",
        name: "Chevrolet Suburban",
        categoryLabel: "EXECUTIVE LUXURY SUV",
        passengers: "6–8 Passengers",
        bags: "6–8 standard suitcases",
        image: "/image-73.webp",
        description:
          "Travel with space and confidence in the Chevrolet Suburban. With three-row seating, impressive luggage capacity, and premium comfort, this spacious SUV is ideal for airport transfers, family travel, corporate transportation, and private events.",
      },
      {
        id: "gls",
        name: "Mercedes-Benz GLS 580",
        categoryLabel: "EXECUTIVE LUXURY SUV",
        passengers: "6 Passengers",
        bags: "4–5 standard suitcases",
        image: "/7jClbfztWIicl0yDu77pUZLM5utpFnTkYv7WYUHV-e1777636492376-1.webp",
        description:
          "Ride in the pinnacle of SUV luxury with the Mercedes-Benz GLS 580. Combining SUV versatility with flagship refinement, it delivers exceptional comfort for executive transfers, private travel, and VIP group transportation.",
      },
    ],
  },
  {
    title: "Vans, Buses & Coaches",
    vehicles: [
      {
        id: "sprinter",
        name: "Mercedes-Benz Sprinter",
        categoryLabel: "EXECUTIVE LUXURY MINI-BUS",
        passengers: "11–14 Passengers",
        bags: "10–14 standard suitcases",
        image: "/limo-1.jpg",
        description:
          "Move together in comfort with the Mercedes-Benz Sprinter. With a spacious, climate-controlled cabin and elevated group-travel experience, it is ideal for corporate teams, wedding parties, airport transfers, and VIP group transportation.",
      },
      {
        id: "mini-bus",
        name: "Executive Mini Bus",
        categoryLabel: "EXECUTIVE MINI-BUS",
        passengers: "15–20 Passengers",
        bags: "15+ bags",
        image: "/mini-bus.jpg",
        description:
          "Perfect for mid-sized groups, our Executive Mini Bus provides a comfortable and professional ride for corporate events, wedding shuttles, airport group transfers, and any occasion requiring reliable luxury group transportation.",
      },
      {
        id: "charter-bus",
        name: "Charter Bus",
        categoryLabel: "CHARTER BUS",
        passengers: "Up to 55 Passengers",
        bags: "Large luggage bay",
        image: "/Charter-Bus-1.webp",
        description:
          "For large groups, our Charter Bus is the perfect solution. Fully equipped with comfortable seating, climate control, and professional drivers — ideal for corporate shuttles, conventions, sporting events, and large-group transportation.",
      },
      {
        id: "motor-coach",
        name: "Motor Coach",
        categoryLabel: "MOTOR COACH",
        passengers: "30–55 Passengers",
        bags: "Large luggage bay",
        image: "/motor-coach.jpg",
        description:
          "Our Motor Coach delivers premium travel for the largest groups. Ideal for conventions, tours, corporate events, and long-distance group travel — with luxury seating, climate control, and onboard amenities throughout.",
      },
    ],
  },
  {
    title: "Specialty Vehicles",
    vehicles: [
      {
        id: "stretch-limo",
        name: "Stretch Limousine",
        categoryLabel: "STRETCH LIMOUSINE",
        passengers: "8–10 Passengers",
        bags: "7 bags",
        image: "/STRETCH LIMOUSINE.jpg",
        description:
          "Make any occasion unforgettable in our classic Stretch Limousine. Perfect for weddings, proms, birthdays, and VIP nights out — featuring a full bar, ambient lighting, premium audio, and a professional chauffeur.",
      },
      {
        id: "roadshow",
        name: "Road Show Vehicle",
        categoryLabel: "ROAD SHOW",
        passengers: "Up to 14 Passengers",
        bags: "7 bags",
        image: "/roadshow.webp",
        description:
          "Catering to individuals and large groups, our Road Show vehicles are dedicated to meeting every convention-related transportation need — from employee shuttles to large-scale tours, we handle every detail.",
      },
      {
        id: "vintage",
        name: "Vintage Classic Car",
        categoryLabel: "VINTAGE CLASSIC",
        passengers: "3–4 Passengers",
        bags: "2 bags",
        image: "/caddy-camp-lucy-full-1-1024x768-1.jpg",
        description:
          "Arrive in timeless style with our Vintage Classic Car collection. From 1940s Cadillac Fleetwoods to classic Jaguars, our vintage fleet is perfect for weddings, photoshoots, film productions, and unforgettable occasions.",
      },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Video Hero ───────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/BlackDrivo%20Main%20Page%20-%202403x1603.png"
          className="absolute inset-0 h-full w-full object-cover"
          src="/herobg.mp4"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,15,26,0.20) 0%, rgba(10,15,26,0.65) 60%, rgba(10,15,26,0.94) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 md:px-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">
            BlackDrivo
          </p>
          <h1 className="font-['Georgia',serif] text-5xl font-bold text-white md:text-7xl">
            Our Fleet
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
            Every vehicle inspected before every trip. Every driver uniformed and vetted.
            Select your vehicle and book in minutes — fixed pricing, 24/7.
          </p>

          {/* Category quick-links */}
          <div className="mt-8 flex flex-wrap gap-2">
            {fleetCategories.map((cat) => (
              <a
                key={cat.title}
                href={`#${cat.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white/60 transition hover:border-white hover:text-white"
              >
                {cat.title}
              </a>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { value: "13+", label: "Vehicle Classes" },
              { value: "3",   label: "States Served"   },
              { value: "24/7", label: "Always Available" },
              { value: "4.9★", label: "Average Rating"  },
            ].map((s) => (
              <div key={s.label} className="bg-black/30 px-6 py-4 backdrop-blur-sm">
                <p className="text-lg font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fleet grid by category ───────────────────────────────────────── */}
      {fleetCategories.map((cat) => (
        <section
          key={cat.title}
          id={cat.title.toLowerCase().replace(/[^a-z]+/g, "-")}
          className="border-t border-gray-100 px-4 py-16 md:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 font-['Georgia',serif] text-3xl font-bold text-gray-900 md:text-4xl">
              {cat.title}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.vehicles.map((v) => (
                <article
                  key={v.id}
                  className={`group flex flex-col bg-white transition-all duration-300 hover:shadow-xl ${
                    v.featured
                      ? "border-2 border-[#0b66d1] shadow-md"
                      : "border border-gray-100 shadow-sm"
                  }`}
                >
                  {/* Vehicle image */}
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gray-50 p-4">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      className="object-contain p-3 transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {v.featured && (
                      <span className="absolute right-3 top-3 bg-[#0b66d1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-['Georgia',serif] text-xl font-bold text-gray-900">
                      {v.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#0b66d1]">
                      {v.categoryLabel}
                    </p>

                    {/* Specs chips */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        <Users className="h-3 w-3" />
                        {v.passengers}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                        <Briefcase className="h-3 w-3" />
                        {v.bags}
                      </span>
                    </div>

                    <hr className="my-4 border-gray-100" />

                    <p className="flex-1 text-sm leading-6 text-gray-500">{v.description}</p>

                    {/* Book now */}
                    <Link
                      href="/booking"
                      className={`mt-6 block py-3 text-center text-xs font-bold uppercase tracking-widest transition-colors ${
                        v.featured
                          ? "bg-[#0b66d1] text-white hover:bg-[#0952a8]"
                          : "border border-[#0b66d1] text-[#0b66d1] hover:bg-[#0b66d1] hover:text-white"
                      }`}
                    >
                      BOOK NOW
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-950 px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">
            Book Your Ride
          </p>
          <h2 className="font-['Georgia',serif] text-3xl font-bold text-white md:text-4xl">
            Need help choosing?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/50">
            Our team is available 24/7 to help you select the perfect vehicle for your journey.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
            >
              Call 24/7
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
