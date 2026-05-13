import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Shield, Award, Clock, Globe, Users, HeartHandshake, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "BlackDrivo is a premium chauffeur service founded to bring world-class ground transportation to New York, New Jersey, and the surrounding tri-state area.",
};

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Every driver undergoes comprehensive background screening, DMV checks, and ongoing performance reviews. Safety is never negotiable.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "Our fleet is carefully maintained and our chauffeurs are trained to deliver a consistent five-star experience on every trip.",
  },
  {
    icon: Clock,
    title: "Punctuality Always",
    description:
      "We track flights, monitor traffic, and dispatch drivers early. On-time performance is our most sacred promise.",
  },
  {
    icon: Globe,
    title: "Nationwide Reach",
    description:
      "While our roots are in New York and New Jersey, our network spans major US cities and airports coast to coast.",
  },
  {
    icon: Users,
    title: "People-Centered",
    description:
      "From the passenger in the back seat to the driver behind the wheel, every person we serve deserves respect and dignity.",
  },
  {
    icon: HeartHandshake,
    title: "Trust & Transparency",
    description:
      "Clear pricing, honest communication, and real-time updates so you always know exactly what to expect.",
  },
];

const milestones = [
  { year: "2019", event: "BlackDrivo founded in New York City" },
  { year: "2020", event: "Expanded to serve all major NYC metro airports" },
  { year: "2021", event: "Launched corporate travel program with 50+ companies" },
  { year: "2022", event: "Reached 10,000 rides milestone" },
  { year: "2023", event: "Expanded service area to full tri-state region" },
  { year: "2024", event: "Launched driver partner program — 300+ active drivers" },
  { year: "2025", event: "Nationwide availability with 500+ cities covered" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-blue-50/50 blur-3xl" />
          <div className="absolute right-10 bottom-10 h-48 w-48 rounded-full bg-blue-50/30 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
                Our story
              </p>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
                Premium rides,<br />
                built on trust.
              </h1>
              <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">
                BlackDrivo was founded with a simple mission: bring world-class chauffeur service
                to New York and New Jersey — the kind of service that business executives, frequent
                travelers, and discerning individuals deserve every single time.
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600">
                We&apos;re not just a car service. We&apos;re a team of professionals who believe
                that how you travel matters. Every detail — from the cleanliness of the vehicle to
                the warmth of the greeting — is something we take seriously.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
                >
                  Book a ride <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
                >
                  Contact us
                </Link>
              </div>
            </div>
            <div
              className="relative h-96 overflow-hidden rounded-3xl lg:h-[500px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
                {[
                  { value: "50K+", label: "Rides" },
                  { value: "500+", label: "Drivers" },
                  { value: "4.9★", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/20 bg-black/40 p-3 text-center backdrop-blur">
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            Our mission
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            To make every journey feel like first class
          </h2>
          <p className="mt-5 text-base leading-8 text-gray-600">
            We believe that premium transportation shouldn&apos;t be reserved for the ultra-wealthy.
            Whether you&apos;re an executive heading to an important meeting or a family arriving at
            JFK after a long flight, you deserve a professional, punctual, and comfortable ride every time.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              What we stand for
            </p>
            <h2 className="text-4xl font-bold text-gray-900">Our values</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition hover:shadow-md hover:border-[#0b66d1]/20"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 border-y border-gray-100 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Our journey
            </p>
            <h2 className="text-4xl font-bold text-gray-900">How we grew</h2>
          </div>
          <div className="relative space-y-6 pl-8">
            <div className="absolute left-2 top-0 h-full w-px bg-gray-200" />
            {milestones.map((m) => (
              <div key={m.year} className="relative">
                <div className="absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-[#0b66d1] bg-white" />
                <p className="text-xs font-bold text-[#0b66d1]">{m.year}</p>
                <p className="mt-0.5 text-sm text-gray-600">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-20 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Experience the difference
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Join thousands of satisfied riders who trust BlackDrivo for every important journey.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] sm:w-auto"
            >
              Book a ride <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-gray-200 px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1] sm:w-auto"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
