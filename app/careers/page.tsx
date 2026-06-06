import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  ArrowRight, MapPin, Clock, Users, Shield, Star,
  TrendingUp, Heart, Zap, Globe,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | BlackDrivo",
  description: "Join the BlackDrivo team. We're hiring passionate people to help redefine premium ground transportation across the United States.",
};

const perks = [
  { icon: TrendingUp, title: "Competitive pay",      desc: "Market-leading salaries with equity participation for key roles."        },
  { icon: Heart,      title: "Health & wellness",    desc: "Full medical, dental, and vision coverage from day one."                 },
  { icon: Zap,        title: "Fast growth",          desc: "We're scaling quickly — your impact and career grow with the company."   },
  { icon: Globe,      title: "Remote-friendly",      desc: "Flexible arrangements for most roles. Work where you do your best."     },
  { icon: Users,      title: "Great team",           desc: "Work alongside experienced operators, engineers, and entrepreneurs."     },
  { icon: Star,       title: "Rider perks",          desc: "Free BlackDrivo credits for all employees — travel in premium comfort." },
];

const roles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    description: "Build the platform that powers thousands of rides daily. You'll own features end-to-end across our Next.js frontend and Supabase backend.",
  },
  {
    title: "Operations Manager — NJ/NY",
    team: "Operations",
    location: "Newark, NJ",
    type: "Full-time",
    description: "Oversee driver relations, dispatch quality, and ride experience in our core market. You're the person who keeps every ride exceptional.",
  },
  {
    title: "Driver Partnerships Lead",
    team: "Driver Growth",
    location: "New York Metro",
    type: "Full-time",
    description: "Recruit, onboard, and retain top-tier professional chauffeurs. You'll build the supply side of our marketplace.",
  },
  {
    title: "Head of Marketing",
    team: "Marketing",
    location: "Remote (US)",
    type: "Full-time",
    description: "Own brand strategy, performance channels, and growth. You'll establish BlackDrivo as the most recognizable name in premium ground transportation.",
  },
  {
    title: "Customer Experience Specialist",
    team: "Support",
    location: "Remote (US)",
    type: "Full-time",
    description: "Deliver white-glove support to our riders and drivers. You'll be the voice of BlackDrivo — calm, professional, and genuinely helpful.",
  },
  {
    title: "Data Analyst",
    team: "Data & Insights",
    location: "Remote (US)",
    type: "Full-time",
    description: "Turn ride data into business decisions. You'll work closely with operations and product to surface insights that drive efficiency and growth.",
  },
];

const steps = [
  { step: "01", title: "Apply online",       desc: "Submit your résumé and a short note about why BlackDrivo excites you."          },
  { step: "02", title: "Intro call",          desc: "A 30-minute conversation with our recruiting team — no prep required."          },
  { step: "03", title: "Skills interview",    desc: "A practical conversation or exercise with the team you'd be joining."           },
  { step: "04", title: "Final round",         desc: "Meet with leadership and get a realistic preview of life at BlackDrivo."        },
  { step: "05", title: "Offer",               desc: "We move fast. Decisions are made within 48 hours of your final conversation."   },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl opacity-60" />
          <div className="absolute right-1/3 top-36 h-72 w-72 rounded-full bg-blue-50/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Careers</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Build something<br className="hidden sm:block" /> that moves people
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base text-gray-500 md:text-lg">
            We're a small, ambitious team on a mission to make premium transportation accessible
            to everyone. Join us and help shape the future of how people move.
          </p>
          <a href="#openings"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
            View open roles <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Culture image band */}
      <section className="px-4 py-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
            ].map((src, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i === 3 ? "hidden sm:block" : ""}`}
                style={{ height: 200, backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Why BlackDrivo</p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What we offer</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map(p => (
              <div key={p.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#0b66d1]/20 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Open positions</p>
            <h2 className="text-3xl font-bold text-gray-900">We&apos;re hiring</h2>
            <p className="mt-3 text-base text-gray-500">All roles are remote-friendly unless stated otherwise.</p>
          </div>
          <div className="space-y-4">
            {roles.map(role => (
              <div key={role.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#0b66d1]">
                      {role.team}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{role.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{role.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{role.type}</span>
                    </div>
                  </div>
                  <a href="mailto:careers@blackdrivo.com"
                    className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition group-hover:border-[#0b66d1] group-hover:text-[#0b66d1]">
                    Apply <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-500">{role.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t see the right role?{" "}
            <a href="mailto:careers@blackdrivo.com" className="font-medium text-[#0b66d1] hover:underline">
              Send us your résumé anyway
            </a>{" "}
            — we&apos;re always looking for great people.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Process</p>
            <h2 className="text-3xl font-bold text-gray-900">How we hire</h2>
            <p className="mt-4 text-base text-gray-500">Respectful, fast, and transparent — from first contact to offer.</p>
          </div>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={s.step} className="flex items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1] text-sm font-bold text-white">
                  {s.step}
                </div>
                <div className={`flex-1 pb-4 ${i < steps.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-[#0b66d1] px-4 py-20 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Shield className="mx-auto mb-5 h-10 w-10 text-white/60" />
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to make an impact?</h2>
          <p className="mt-4 text-base text-white/70">
            Join a team that cares deeply about the product, the people, and the riders we serve.
          </p>
          <a href="mailto:careers@blackdrivo.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0b66d1] transition hover:bg-blue-50">
            Get in touch <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
