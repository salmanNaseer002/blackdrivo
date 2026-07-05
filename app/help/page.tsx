import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Plane, CreditCard, Car, MessageCircle, Clock, Shield,
  Phone, Mail, ArrowRight, Search, ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | BlackDrivo",
  description: "Find answers to your questions about booking, payments, cancellations, and more. BlackDrivo support is available 24/7.",
};

const categories = [
  {
    icon: Plane,
    title: "Bookings",
    desc: "How to book, modify, or cancel a ride",
    href: "#bookings",
    count: "8 articles",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    desc: "Pricing, receipts, refunds, and charges",
    href: "#billing",
    count: "6 articles",
  },
  {
    icon: Car,
    title: "Your Ride",
    desc: "Vehicle types, luggage, wait time, and more",
    href: "#ride",
    count: "7 articles",
  },
  {
    icon: Shield,
    title: "Safety",
    desc: "Driver vetting, trip protection, and policies",
    href: "#safety",
    count: "5 articles",
  },
  {
    icon: MessageCircle,
    title: "Account",
    desc: "Sign in, profile, and notification settings",
    href: "#account",
    count: "4 articles",
  },
  {
    icon: Clock,
    title: "Special Requests",
    desc: "Child seats, meet & greet, and accessibility",
    href: "#special",
    count: "5 articles",
  },
];

const faqs: { section: string; id: string; items: { q: string; a: string }[] }[] = [
  {
    section: "Bookings",
    id: "bookings",
    items: [
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 2 hours ahead for standard rides. For airport pickups, corporate events, or group travel, booking 24 hours in advance ensures driver availability.",
      },
      {
        q: "Can I book a ride for someone else?",
        a: "Yes. During checkout enter the passenger's name and contact number. Your payment method is used for the booking and the passenger receives pickup updates directly.",
      },
      {
        q: "How do I modify or cancel my booking?",
        a: "Log into your account and visit My Bookings. You can modify pickup time or location up to 2 hours before the ride. Cancellations made more than 1 hour before pickup are fully refunded.",
      },
      {
        q: "What happens if I need to change my pickup time last minute?",
        a: "Contact us via phone or WhatsApp and we will do our best to accommodate. Changes within 60 minutes of pickup may incur a small adjustment fee.",
      },
      {
        q: "Is there a minimum booking time?",
        a: "Hourly bookings start at a minimum of 2 hours. One-way and airport transfer bookings have no minimum duration — you pay only for your trip.",
      },
    ],
  },
  {
    section: "Billing & Payments",
    id: "billing",
    items: [
      {
        q: "When am I charged for my ride?",
        a: "Your card is authorized at booking and charged after the ride is completed. The final amount reflects the actual trip including any tolls, wait time, or extras.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards via Stripe. Corporate accounts can arrange invoiced billing with net payment terms.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No. Your quoted fare includes the base rate, standard tolls, and driver gratuity. Any extras (parking, airport fees, extended wait) are shown clearly before you confirm.",
      },
      {
        q: "How do I get a receipt?",
        a: "A detailed receipt is emailed automatically after each completed ride. You can also download receipts from the Payments section of your account.",
      },
      {
        q: "What is the cancellation refund policy?",
        a: "Cancellations more than 1 hour before pickup receive a full refund. Cancellations within 60 minutes of pickup or no-shows are charged a 50% fee.",
      },
    ],
  },
  {
    section: "Your Ride",
    id: "ride",
    items: [
      {
        q: "What vehicle classes are available?",
        a: "We offer four classes: Business (premium sedans), First Class (luxury sedans), SUV (large SUVs for groups up to 6), and Van (for larger groups or extra luggage).",
      },
      {
        q: "How much luggage can I bring?",
        a: "Business and First Class vehicles accommodate 2 standard checked bags. SUV and Van accommodate 4–6 bags. Need more space? Note it in Special Requests at booking.",
      },
      {
        q: "Is there a wait time allowance at airports?",
        a: "Yes. Domestic arrivals include 60 minutes of complimentary wait. International arrivals include 90 minutes. Additional waiting time is charged at the posted hourly rate.",
      },
      {
        q: "Does the driver track my flight?",
        a: "Yes. All airport transfers include live flight tracking. If your flight is delayed or lands early, your driver adjusts automatically with no action needed from you.",
      },
    ],
  },
  {
    section: "Safety",
    id: "safety",
    items: [
      {
        q: "How are drivers vetted?",
        a: "Every BlackDrivo chauffeur passes a comprehensive background check, DMV records review, in-person interview, and vehicle inspection before their first trip.",
      },
      {
        q: "Are vehicles insured?",
        a: "Yes. All vehicles in our network are fully commercially insured for passenger transportation. Coverage details are available on request.",
      },
      {
        q: "Can I share my trip with someone?",
        a: "Yes. From My Bookings, tap Share Trip to send a live link with your driver details and real-time location to any contact.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-16 h-80 w-80 rounded-full bg-blue-50 blur-3xl opacity-60" />
          <div className="absolute right-1/4 top-32 h-64 w-64 rounded-full bg-blue-50/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            How can we help?
          </h1>
          <p className="mt-4 text-base text-gray-500 md:text-lg">
            Browse our help articles or reach our team directly — we're available 24/7.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Browse by topic</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(cat => (
              <a key={cat.title} href={cat.href}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1] transition group-hover:bg-[#0b66d1] group-hover:text-white">
                  <cat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{cat.title}</p>
                    <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:text-[#0b66d1]" />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{cat.desc}</p>
                  <p className="mt-2 text-xs font-medium text-[#0b66d1]">{cat.count}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-16">
          {faqs.map(section => (
            <div key={section.id} id={section.id}>
              <h2 className="mb-6 text-xl font-bold text-gray-900">{section.section}</h2>
              <div className="space-y-3">
                {section.items.map(item => (
                  <details key={item.q}
                    className="group rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition open:border-[#0b66d1]/20 open:shadow-md">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 marker:hidden">
                      {item.q}
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact support */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white p-8 ">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Talk to our team</h2>
              <p className="mt-4 text-base text-gray-500">
                We're available 24 hours a day, 7 days a week — no bots, no scripts.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <a href="tel:+18005550199"
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1] text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Call us</p>
                  <p className="font-semibold text-gray-900">+1 (800) 555-0199</p>
                  <p className="text-xs text-gray-500">Available 24/7</p>
                </div>
              </a>
              <a href="mailto:support@blackdrivo.com"
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-6 py-5 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1] text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email us</p>
                  <p className="font-semibold text-gray-900">support@blackdrivo.com</p>
                  <p className="text-xs text-gray-500">Reply within 2 hours</p>
                </div>
              </a>
            </div>
            <div className="mt-6 text-center">
              <Link href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
                Open a support ticket <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
