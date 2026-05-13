import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Plane, Clock, MapPin, Briefcase, Star, CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Premium black car services: airport transfers, hourly chauffeur, city-to-city rides, corporate travel, and event transportation across New York, New Jersey, and the US.",
};

const services = [
  {
    id: "airport",
    icon: Plane,
    title: "Airport Transfers",
    tagline: "Smooth landings, every time.",
    description:
      "Your chauffeur tracks your flight in real-time and is there when you land — whether early, on time, or delayed. Available at all major airports across the NY/NJ area.",
    features: [
      "Live flight tracking & automatic adjustment",
      "60 minutes complimentary wait time (domestic)",
      "90 minutes complimentary wait time (international)",
      "Meet & greet or curbside options",
      "Luggage assistance included",
      "Available at JFK, LGA, EWR, HPN, ISP & more",
    ],
    image:
      "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "hourly",
    icon: Clock,
    title: "Hourly Chauffeur",
    tagline: "Your driver, your schedule.",
    description:
      "Reserve a dedicated chauffeur from 2 to 24 hours. Perfect for full days in the city, multiple meetings, or whenever you need a driver on standby ready to move at a moment's notice.",
    features: [
      "Book from 2 to 24 hours",
      "Multiple stops included",
      "Driver stays on standby throughout",
      "Flexible scheduling changes",
      "Perfect for NYC business days",
      "Available for events and personal errands",
    ],
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "city",
    icon: MapPin,
    title: "City-to-City Rides",
    tagline: "Between cities, done better.",
    description:
      "Turn long-distance drives into productive, comfortable journeys. NY to DC, NYC to Boston, NJ to Philadelphia — any route, any distance, in a premium vehicle.",
    features: [
      "Fixed flat-rate pricing",
      "NYC to DC, Boston, Philadelphia & more",
      "Wi-Fi enabled vehicles available",
      "Complimentary water & charging cables",
      "Professional chauffeur throughout",
      "Door-to-door service",
    ],
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "corporate",
    icon: Briefcase,
    title: "Corporate Travel",
    tagline: "Business travel, simplified.",
    description:
      "Streamline ground transportation for your entire organization. Centralized billing, team management, and a consistent premium experience that reflects your company's standards.",
    features: [
      "Centralized billing & invoicing",
      "Team & employee accounts",
      "Travel policy enforcement",
      "Dedicated account manager",
      "Priority booking support",
      "Monthly reporting & analytics",
    ],
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "events",
    icon: Star,
    title: "Event Transportation",
    tagline: "Arrive the way you deserve.",
    description:
      "Make every special occasion unforgettable with a luxury chauffeur. Weddings, galas, Broadway shows, sporting events, corporate functions — we coordinate every detail.",
    features: [
      "Wedding car service & coordination",
      "Corporate event transportation",
      "Concert & sporting event transfers",
      "Galas, fundraisers & black-tie events",
      "Group coordination for multiple vehicles",
      "Professional uniformed chauffeurs",
    ],
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  },
];

const vehicleClasses = [
  {
    name: "Business Class",
    seats: 3,
    bags: 2,
    examples: "Mercedes E-Class, BMW 5 Series, Audi A6",
    description: "Executive sedans for professional and corporate travel.",
  },
  {
    name: "First Class",
    seats: 3,
    bags: 2,
    examples: "Mercedes S-Class, BMW 7 Series, Audi A8",
    description: "Top-tier luxury for VIP clients and special occasions.",
  },
  {
    name: "Business SUV",
    seats: 6,
    bags: 5,
    examples: "Cadillac Escalade, Mercedes GLS, Lincoln Navigator",
    description: "Premium SUVs for groups, families, and extra luggage.",
  },
  {
    name: "Business Van",
    seats: 7,
    bags: 7,
    examples: "Mercedes Sprinter, Ford Transit, VW Transporter",
    description: "Large vans for groups, airport runs, and event transportation.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-50 px-4 pb-16 pt-32 text-center md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-50 blur-3xl" />
          <div className="absolute left-1/4 top-32 h-48 w-48 rounded-full bg-blue-50/50 blur-2xl" />
          <div className="absolute right-1/4 top-32 h-48 w-48 rounded-full bg-blue-50/50 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            Our services
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Every ride,<br />a premium experience
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-gray-600 md:text-lg">
            From quick airport transfers to multi-city tours, BlackDrivo delivers luxury
            ground transportation tailored to every journey.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Book a ride <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Service sections */}
      <section className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 pt-8">
          {services.map((service, i) => (
            <div
              key={service.id}
              id={service.id}
              className={`overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm ${i % 2 === 0 ? "" : "bg-gray-50"}`}
            >
              <div className={`grid lg:grid-cols-2 ${i % 2 !== 0 ? "lg:grid-flow-dense" : ""}`}>
                <div
                  className={`relative min-h-72 lg:min-h-0 ${i % 2 !== 0 ? "lg:col-start-2" : ""}`}
                  style={{
                    backgroundImage: `url('${service.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${i % 2 !== 0 ? "from-transparent to-white/10" : "from-white/10 to-transparent"}`} />
                </div>
                <div className={`p-8 md:p-10 ${i % 2 !== 0 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
                    {service.tagline}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900">{service.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{service.description}</p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/booking?service=${service.id}`}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
                  >
                    Book {service.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicle Classes */}
      <section className="bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Our fleet
            </p>
            <h2 className="text-4xl font-bold text-gray-900">Vehicle classes</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
              Every vehicle is regularly maintained, fully insured, and driven by a vetted professional chauffeur.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vehicleClasses.map((v) => (
              <div
                key={v.name}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition hover:shadow-md hover:border-[#0b66d1]/20"
              >
                <h3 className="font-semibold text-gray-900">{v.name}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-500">{v.description}</p>
                <div className="mt-4 space-y-1.5 text-xs text-gray-500">
                  <p>Up to {v.seats} passengers</p>
                  <p>{v.bags} bags</p>
                </div>
                <p className="mt-3 text-xs text-gray-400">{v.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
