import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | BlackDrivo",
  description: "BlackDrivo Terms of Service — your rights and obligations when booking or using our premium chauffeured transportation platform.",
};

const sections = [
  {
    id: "1",
    title: "Acceptance of Terms",
    body: `By accessing or using BlackDrivo's website, mobile application, or booking services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services. These terms apply to all users including passengers, drivers, and visitors.`,
  },
  {
    id: "2",
    title: "Service Description",
    body: `BlackDrivo is a technology platform that connects passengers with professional chauffeurs for premium ground transportation including airport transfers, hourly chauffeur service, and city-to-city rides. All transportation services are provided by independently contracted, vetted drivers operating vehicles that meet our quality standards.`,
  },
  {
    id: "3",
    title: "Booking & Reservations",
    body: `Bookings are confirmed upon receipt of a confirmation email or in-app notification. You agree to provide accurate pickup information, passenger count, and any applicable flight details. BlackDrivo reserves the right to decline or cancel bookings at its discretion. Changes to active bookings are subject to availability and may incur adjustment fees.`,
  },
  {
    id: "4",
    title: "Pricing & Payments",
    body: `Fares are estimated at booking and finalized after trip completion based on actual distance, duration, tolls, and any extras confirmed at booking. All charges are processed securely via Stripe. By providing payment details, you authorize BlackDrivo to charge you the confirmed fare plus any applicable extras. All fares are displayed in USD.`,
  },
  {
    id: "5",
    title: "Cancellation Policy",
    body: `Cancellations made more than 1 hour before the scheduled pickup time receive a full refund. Cancellations within 60 minutes of pickup or no-shows are subject to a fee of up to 50% of the confirmed fare. Refunds are processed within 5–10 business days depending on your payment provider.`,
  },
  {
    id: "6",
    title: "Passenger Conduct",
    body: `Passengers are responsible for their own conduct and that of any guests during the ride. Unsafe, abusive, or illegal behavior will result in immediate trip termination and may result in account suspension. Damage to a BlackDrivo vehicle caused by a passenger is the financial responsibility of the passenger.`,
  },
  {
    id: "7",
    title: "Limitation of Liability",
    body: `BlackDrivo is not liable for delays caused by weather, traffic, flight disruptions, or force majeure events. Our total liability for any claim arising from use of our services is limited to the amount paid for the specific booking in dispute. We are not responsible for items left in vehicles, though we will assist in recovery efforts where possible.`,
  },
  {
    id: "8",
    title: "Intellectual Property",
    body: `All content on the BlackDrivo platform — including logos, copy, designs, and software — is owned by or licensed to BlackDrivo and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.`,
  },
  {
    id: "9",
    title: "Privacy",
    body: `Your use of BlackDrivo is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our data practices.`,
  },
  {
    id: "10",
    title: "Modifications",
    body: `BlackDrivo reserves the right to update these Terms at any time. Continued use of the service after changes constitutes acceptance of the revised Terms. We will notify users of material changes via email or in-app notification.`,
  },
  {
    id: "11",
    title: "Governing Law",
    body: `These Terms are governed by the laws of the State of New Jersey, United States, without regard to conflict of law principles. Any disputes will be resolved in the courts of New Jersey unless otherwise required by applicable consumer protection law.`,
  },
  {
    id: "12",
    title: "Contact",
    body: `Questions about these Terms? Reach our legal team at legal@blackdrivo.com or write to: BlackDrivo Inc., New Jersey, United States.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="border-b border-gray-100 bg-gray-50 px-4 pb-12 pt-32 md:pt-44">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-900">
            ← Back to home
          </Link>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-gray-500">
            Effective: January 1, 2025 · Last updated: June 1, 2025
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            These Terms govern your use of BlackDrivo and apply to all ride requests, bookings,
            and transportation services in the United States. Please read them carefully.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

            {/* Sticky TOC */}
            <aside className="mb-10 lg:mb-0">
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Contents</p>
                <nav className="space-y-0.5">
                  {sections.map(s => (
                    <a key={s.id} href={`#section-${s.id}`}
                      className="block rounded-lg px-3 py-1.5 text-xs text-gray-600 transition hover:bg-white hover:text-[#0b66d1]">
                      {s.id}. {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Body */}
            <div className="space-y-10">
              {sections.map(s => (
                <div key={s.id} id={`section-${s.id}`} className="scroll-mt-28">
                  <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0b66d1] text-xs font-bold text-white">
                      {s.id}
                    </span>
                    {s.title}
                  </h2>
                  <p className="mt-3 text-sm leading-8 text-gray-600">{s.body}</p>
                </div>
              ))}

              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5">
                <p className="text-sm font-semibold text-gray-900">Have questions about our Terms?</p>
                <p className="mt-1 text-sm text-gray-600">
                  Email{" "}
                  <a href="mailto:legal@blackdrivo.com" className="font-medium text-[#0b66d1] hover:underline">
                    legal@blackdrivo.com
                  </a>{" "}
                  — we respond within 2 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer links */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500">Related:</span>
          {[
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Accessibility",  href: "/accessibility"  },
            { label: "Help Center",    href: "/help"           },
            { label: "Contact Us",     href: "/contact"        },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
