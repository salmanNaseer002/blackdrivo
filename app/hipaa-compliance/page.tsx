import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Shield, Lock, Eye, CheckCircle, FileText, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HIPAA Compliance | BlackDrivo",
  description: "BlackDrivo's HIPAA compliance framework for medical transportation — how we safeguard protected health information for healthcare facilities and patients.",
};

const safeguards = [
  {
    icon: Lock,
    title: "Technical Safeguards",
    items: [
      "End-to-end TLS encryption for all data in transit",
      "AES-256 encryption for stored patient and booking data",
      "Role-based access controls limiting PHI exposure",
      "Automatic session timeouts on inactive accounts",
      "Audit logging of all PHI access events",
    ],
  },
  {
    icon: Shield,
    title: "Administrative Safeguards",
    items: [
      "Designated Privacy & Security Officer",
      "Annual HIPAA training for all staff handling PHI",
      "Business Associate Agreements (BAA) with covered entities",
      "Documented incident response and breach notification procedures",
      "Regular risk assessments and policy reviews",
    ],
  },
  {
    icon: Eye,
    title: "Physical Safeguards",
    items: [
      "Secure, access-controlled data center infrastructure",
      "No PHI stored on personal or unmanaged devices",
      "Workstation and device use policies",
      "Secure media disposal protocols",
      "Visitor and contractor access logging",
    ],
  },
];

const faqs = [
  {
    q: "What is a Business Associate Agreement (BAA)?",
    a: "A BAA is a HIPAA-required contract between a covered entity (e.g., a hospital) and a business associate (BlackDrivo) that outlines our obligations to protect PHI. We provide BAAs to all qualifying healthcare partners at no additional cost.",
  },
  {
    q: "What patient information does BlackDrivo handle?",
    a: "For medical transport bookings, we may handle the patient's name, contact details, pickup/drop-off addresses, and appointment information. We collect only what is necessary to fulfill the transportation request.",
  },
  {
    q: "How do you handle a data breach?",
    a: "In the event of a breach involving PHI, we follow our documented incident response plan — including immediate containment, forensic investigation, and notification to affected covered entities within the HIPAA-required 60-day window.",
  },
  {
    q: "Can our healthcare organization request a BAA?",
    a: "Yes. Contact our compliance team at compliance@blackdrivo.com and we will initiate the BAA process within 2 business days. BAAs are standard for all healthcare facility accounts.",
  },
  {
    q: "Is your infrastructure HIPAA-certified?",
    a: "Our cloud infrastructure is hosted on HIPAA-eligible services with signed BAAs in place. We maintain documentation of all third-party BAAs as required by the HIPAA Security Rule.",
  },
];

export default function HIPAACompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl opacity-50" />
          <div className="absolute right-1/4 top-36 h-64 w-64 rounded-full bg-blue-50/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Compliance</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            HIPAA Compliance
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base text-gray-500 md:text-lg">
            BlackDrivo takes the security and privacy of protected health information seriously.
            Our compliance framework meets HIPAA requirements for medical transportation providers
            and healthcare facility partners.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="mailto:compliance@blackdrivo.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              Request a BAA <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              Talk to compliance
            </Link>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="border-y border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Our commitment</p>
          <h2 className="text-3xl font-bold text-gray-900">Data protection is core to our service</h2>
          <p className="mt-5 text-base leading-8 text-gray-600">
            When healthcare facilities trust BlackDrivo to transport their patients, they are
            entrusting us with sensitive protected health information. We treat that trust as a
            core responsibility — maintaining strict technical, administrative, and physical
            safeguards that meet or exceed HIPAA Security Rule requirements.
          </p>
        </div>
      </section>

      {/* Safeguards */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Framework</p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Our HIPAA safeguards</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {safeguards.map(s => (
              <div key={s.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-4 font-semibold text-gray-900">{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BAA Section */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0b66d1]">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">For healthcare partners</p>
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Business Associate Agreement</h2>
                <p className="mt-4 text-base text-gray-500">
                  We provide signed Business Associate Agreements to all covered entities and
                  healthcare organizations as required by HIPAA. BAAs are provided at no cost
                  and processed within 48 hours of request.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="mailto:compliance@blackdrivo.com"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                  <span className="text-sm font-medium text-gray-900">Request a BAA</span>
                  <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
                </a>
                <a href="mailto:compliance@blackdrivo.com"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                  <span className="text-sm font-medium text-gray-900">Compliance documentation</span>
                  <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
                </a>
                <a href="mailto:compliance@blackdrivo.com"
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                  <span className="text-sm font-medium text-gray-900">Security questions</span>
                  <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(item => (
              <details key={item.q}
                className="group rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm open:border-[#0b66d1]/20">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900 marker:hidden">
                  {item.q}
                  <span className="text-gray-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500">Related:</span>
          {[
            { label: "Privacy Policy",    href: "/privacy-policy"   },
            { label: "Terms of Service",  href: "/terms-of-service" },
            { label: "Accessibility",     href: "/accessibility"    },
            { label: "Contact Us",        href: "/contact"          },
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
