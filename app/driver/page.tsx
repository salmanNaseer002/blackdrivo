import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  DollarSign, Clock, Headphones, Users, CheckCircle, ArrowRight,
  Star, Shield, Car
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drive with BlackDrivo — Join Our Chauffeur Network",
  description:
    "Join BlackDrivo's professional chauffeur network. Earn premium rates, set your own schedule, and be part of New York's most respected black car service.",
};

const benefits = [
  {
    icon: DollarSign,
    title: "Premium Earnings",
    desc: "Earn significantly more than standard rideshare apps with premium fixed-rate bookings.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    desc: "Work when you want — accept only the rides you choose. No minimum hours required.",
  },
  {
    icon: Headphones,
    title: "Full Support",
    desc: "Dedicated support team available 24/7 for drivers. We're here whenever you need us.",
  },
  {
    icon: Users,
    title: "Professional Community",
    desc: "Join a vetted network of professional chauffeurs with high standards and shared values.",
  },
];

const steps = [
  {
    number: "01",
    title: "Submit Application",
    desc: "Complete our driver application in under 10 minutes. Tell us about yourself and your vehicle.",
  },
  {
    number: "02",
    title: "Get Verified",
    desc: "Background check, license verification, and vehicle inspection — we'll guide you through every step.",
  },
  {
    number: "03",
    title: "Start Earning",
    desc: "Once approved, access your driver dashboard, go online, and start accepting premium rides.",
  },
];

const requirements = [
  "Valid driver's license with 3+ years experience",
  "Commercial vehicle insurance",
  "Background check clearance",
  "Vehicle model year 2018 or newer",
  "Clean driving record",
  "TLC/FHV license for NYC drivers",
];

const driverTestimonials = [
  {
    name: "Marcus J.",
    location: "Queens, NY",
    text: "BlackDrivo changed my career. The rides are premium, clients are respectful, and the earnings are significantly better than any other platform I've tried.",
    earnings: "$3,200/mo avg",
  },
  {
    name: "David R.",
    location: "Newark, NJ",
    text: "The flexibility is unmatched. I choose my own hours, accept only what I want, and the support team is always there if I have a question.",
    earnings: "$2,900/mo avg",
  },
  {
    name: "Robert T.",
    location: "Manhattan, NY",
    text: "I've been with BlackDrivo for 2 years. The corporate clients are consistent, the rides are straightforward, and the pay is always on time.",
    earnings: "$4,100/mo avg",
  },
];

export default function DriverLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        className="relative flex min-h-screen w-full items-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(10,15,26,0.55) 0%, rgba(10,15,26,0.78) 100%), url('/A%20welcome%20like%20no%20other.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0b66d1]" />
              Driver Partner Program
            </div>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
              Drive With
              <br />
              <span className="text-[#0b66d1]">BlackDrivo</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70 md:text-lg">
              Join our network of professional chauffeurs serving New York, New Jersey, and nationwide.
              Earn more. Work smarter. Build a career you're proud of.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/driver/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm sm:grid-cols-4">
            {[
              { value: "500+", label: "Active Drivers" },
              { value: "$2,800", label: "Avg Monthly Earnings" },
              { value: "4.9★", label: "Driver Rating" },
              { value: "24/7", label: "Driver Support" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-6 py-8 text-center">
                <p className="text-3xl font-bold text-gray-900 md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Why drive with us
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Built for professional drivers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
              BlackDrivo gives you the tools, support, and earning potential to build a serious career in premium transportation.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition hover:shadow-md hover:border-[#0b66d1]/20">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{b.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Getting started
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Three steps to start earning
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute left-1/2 top-8 hidden h-px w-full bg-gray-200 sm:block" style={{ left: "75%", width: "50%" }} />
                )}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b66d1] text-2xl font-bold text-white shadow-lg">
                  {s.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/driver/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              Start Your Application <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Earnings section */}
      <section className="bg-[#0b66d1] px-4 py-20 md:px-6 lg:px-8 lg:py-28" style={{ backgroundImage: "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/60">
                Earning potential
              </p>
              <h2 className="text-4xl font-bold text-white md:text-5xl">
                Average drivers earn
                <br />
                <span className="text-white/90">$2,800–$4,500/month</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70">
                Our premium fixed-rate model means you know exactly what you're earning before every ride.
                No surge pricing tricks — just consistent, high-quality income.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Fixed fares — no surprises",
                  "Weekly direct deposit",
                  "No platform fees on corporate rides",
                  "Bonuses for top-rated drivers",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 shrink-0 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/driver/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0b66d1] transition hover:bg-gray-100"
              >
                Apply to Drive <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Airport Transfer", earn: "$85–$185", note: "Per trip" },
                { label: "City-to-City", earn: "$200–$480", note: "Per trip" },
                { label: "Hourly Service", earn: "$55–$90", note: "Per hour" },
                { label: "Corporate Account", earn: "Priority dispatch", note: "Recurring income" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/10 border border-white/20 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{item.earn}</p>
                  <p className="text-xs text-white/50">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
                Requirements
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                What you&apos;ll need to apply
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                We maintain high standards because our clients expect the best. Here&apos;s what&apos;s required to join.
              </p>
              <ul className="mt-8 space-y-4">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <CheckCircle className="h-3.5 w-3.5 text-[#0b66d1]" />
                    </div>
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Application takes 10 minutes</h3>
                  <p className="text-sm text-gray-500">We review within 2–3 business days</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Create account & fill out form" },
                  { step: "2", label: "Upload required documents" },
                  { step: "3", label: "Background check (automated)" },
                  { step: "4", label: "Vehicle inspection (local)" },
                  { step: "5", label: "Receive approval & go live" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0b66d1] text-xs font-bold text-white">
                      {item.step}
                    </div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/driver/signup"
                className="mt-6 block rounded-xl bg-[#0b66d1] py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#0952a8]"
              >
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Driver testimonials */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              Driver stories
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Hear from our drivers
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {driverTestimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition hover:shadow-md">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#0b66d1] text-[#0b66d1]" />
                  ))}
                </div>
                <p className="text-sm leading-6 text-gray-700">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#0b66d1]">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location}</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {t.earnings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 px-4 py-20 text-center md:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b66d1]">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Ready to start earning?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-white/60">
            Join hundreds of professional chauffeurs who have made BlackDrivo their primary income source.
            Applications take 10 minutes. Approvals within 2–3 business days.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/driver/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] sm:w-auto"
            >
              Apply to Drive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/8 sm:w-auto"
            >
              Ask a question
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/30">
            No commitment required · Free to apply · Results within 3 business days
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
