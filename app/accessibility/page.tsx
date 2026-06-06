import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Eye, Volume2, Keyboard, Smartphone, CheckCircle,
  Mail, ArrowRight, Shield, MessageCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | BlackDrivo",
  description: "BlackDrivo is committed to making premium transportation accessible to everyone. Learn about our accessibility features, policies, and how to request assistance.",
};

const features = [
  {
    icon: Eye,
    title: "Screen reader compatible",
    desc: "Our website and app are tested with NVDA, JAWS, and VoiceOver to ensure content is fully accessible to users who rely on screen readers.",
  },
  {
    icon: Keyboard,
    title: "Full keyboard navigation",
    desc: "Every interactive element on our platform is reachable and operable using a keyboard alone — no mouse required.",
  },
  {
    icon: Volume2,
    title: "Audio & video captions",
    desc: "All video content on our platform includes closed captions. Audio descriptions are available for key instructional videos.",
  },
  {
    icon: Smartphone,
    title: "Mobile accessibility",
    desc: "Our iOS and Android apps are built to WCAG 2.1 AA standards, including support for dynamic text sizing and gesture navigation.",
  },
  {
    icon: Shield,
    title: "Secure & private",
    desc: "Accessibility preferences are stored securely and never shared with third parties. You control your experience.",
  },
  {
    icon: MessageCircle,
    title: "Human support",
    desc: "Our 24/7 support team is trained to assist users with disabilities. Phone, email, and live chat options are always available.",
  },
];

const rideFeatures = [
  "Wheelchair-accessible vehicles (WAV) available upon request",
  "Door-to-door service with driver assistance",
  "Extra wait time for passengers who need more time to board",
  "Child safety seats available at no additional charge",
  "Service animals welcome in all BlackDrivo vehicles",
  "Medical transport coordination with advance booking",
  "Large-vehicle options for mobility equipment",
  "Quiet ride preference available for sensory-sensitive passengers",
];

const wcagItems = [
  { criterion: "1.1 Text Alternatives",    status: "Meets AA" },
  { criterion: "1.3 Adaptable",            status: "Meets AA" },
  { criterion: "1.4 Distinguishable",      status: "Meets AA" },
  { criterion: "2.1 Keyboard Accessible",  status: "Meets AA" },
  { criterion: "2.4 Navigable",            status: "Meets AA" },
  { criterion: "3.1 Readable",             status: "Meets AA" },
  { criterion: "3.3 Input Assistance",     status: "Meets AA" },
  { criterion: "4.1 Compatible",           status: "Meets AA" },
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl opacity-50" />
          <div className="absolute right-1/4 top-40 h-64 w-64 rounded-full bg-blue-50/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Accessibility</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Premium rides<br className="hidden sm:block" /> for everyone
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base text-gray-500 md:text-lg">
            BlackDrivo is committed to ensuring that our services, website, and app are
            accessible to all users, including those with disabilities.
          </p>
        </div>
      </section>

      {/* Commitment statement */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Our commitment</p>
          <h2 className="text-3xl font-bold text-gray-900">Accessibility is not optional</h2>
          <p className="mt-5 text-base leading-8 text-gray-600">
            We believe that everyone deserves access to safe, comfortable, and professional
            transportation — regardless of ability. BlackDrivo is actively working to meet
            and exceed WCAG 2.1 Level AA standards across our entire digital and physical experience.
            This page is updated regularly as we make improvements.
          </p>
          <p className="mt-3 text-sm text-gray-500">Last reviewed: June 2025</p>
        </div>
      </section>

      {/* Digital features */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Digital platform</p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Website & app features</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#0b66d1]/20 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ride accessibility */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">In the vehicle</p>
            <h2 className="text-3xl font-bold text-gray-900">Ride accessibility features</h2>
            <p className="mt-4 text-base text-gray-500">
              Add any special requirements in the Notes field when booking, or contact us directly to arrange accessible transportation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {rideFeatures.map(feature => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
                <p className="text-sm text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Need a service not listed above?{" "}
            <Link href="/contact" className="font-medium text-[#0b66d1] hover:underline">
              Contact our accessibility team
            </Link>{" "}
            — we will do our best to accommodate every request.
          </p>
        </div>
      </section>

      {/* WCAG compliance table */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Compliance</p>
            <h2 className="text-3xl font-bold text-gray-900">WCAG 2.1 conformance</h2>
            <p className="mt-4 text-base text-gray-500">
              Our current conformance status against WCAG 2.1 Level AA success criteria.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {wcagItems.map((item, i) => (
              <div key={item.criterion}
                className={`flex items-center justify-between px-6 py-4 ${i < wcagItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                <span className="text-sm font-medium text-gray-700">{item.criterion}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle className="h-3.5 w-3.5" /> {item.status}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Areas that do not yet fully conform are actively being remediated. Contact us for a full VPAT.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Feedback</p>
              <h2 className="text-3xl font-bold text-gray-900">We want to improve</h2>
              <p className="mt-4 text-base text-gray-500">
                If you experience any barriers while using BlackDrivo — on our website, app,
                or during a ride — please tell us. Your feedback directly shapes our improvements.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a href="mailto:accessibility@blackdrivo.com"
                className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1] text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900">accessibility@blackdrivo.com</p>
                </div>
              </a>
              <Link href="/contact"
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-900 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                Submit feedback form <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
