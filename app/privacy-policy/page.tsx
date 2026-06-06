import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | BlackDrivo",
  description: "Learn how BlackDrivo collects, uses, and protects your personal data when you book or use our premium chauffeured transportation services.",
};

const sections = [
  {
    id: "1",
    title: "Information We Collect",
    body: `When you book a ride or create an account, we collect information you provide directly — including your name, email address, phone number, and payment details. We also collect trip data such as pickup and drop-off locations and booking history. Additionally, we gather technical data including your device type, IP address, and usage patterns to improve our platform.`,
  },
  {
    id: "2",
    title: "How We Use Your Information",
    body: `We use your information to process and fulfill bookings, provide customer support, send booking confirmations and ride updates, and improve the overall quality of our service. We may also use aggregated, anonymized data for business analytics and reporting. We will not use your data for purposes unrelated to transportation services without your explicit consent.`,
  },
  {
    id: "3",
    title: "Sharing Your Information",
    body: `We share only the minimum necessary booking information with the chauffeur assigned to your ride (your name, pickup location, and phone number for coordination). We do not sell your personal data. We may share information with trusted service providers — such as payment processors and cloud infrastructure partners — under strict data processing agreements. We may disclose data when required by law.`,
  },
  {
    id: "4",
    title: "Data Retention",
    body: `We retain your personal data for as long as your account is active or as needed to provide services. Booking records are retained for up to 7 years for legal and tax compliance. You may request deletion of your account and associated data at any time by contacting support@blackdrivo.com, subject to legal retention requirements.`,
  },
  {
    id: "5",
    title: "Data Security",
    body: `We implement industry-standard technical and organizational safeguards to protect your data, including TLS encryption in transit, encrypted storage, access controls, and regular security audits. We use Stripe for all payment processing — BlackDrivo never stores raw card numbers. While we take security seriously, no system is completely immune to risk, and we encourage you to use a strong password and keep your account credentials private.`,
  },
  {
    id: "6",
    title: "Your Rights",
    body: `Depending on your location, you may have rights to access, correct, or delete your personal data; request a copy of your data in a portable format; withdraw consent for non-essential data processing; and opt out of marketing communications. To exercise any of these rights, contact us at privacy@blackdrivo.com. We will respond within 30 days.`,
  },
  {
    id: "7",
    title: "Cookies & Tracking",
    body: `We use essential cookies to keep you logged in and process bookings. We may use analytics cookies to understand how visitors use our site. You can disable non-essential cookies in your browser settings. We do not use cross-site tracking for advertising purposes.`,
  },
  {
    id: "8",
    title: "Children's Privacy",
    body: `BlackDrivo is not directed at children under 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, contact us immediately and we will promptly delete it.`,
  },
  {
    id: "9",
    title: "Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice in our app at least 30 days before the changes take effect. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: "10",
    title: "Contact Us",
    body: `For privacy questions, data requests, or concerns, contact our Privacy Team at privacy@blackdrivo.com. You may also write to: BlackDrivo Inc., Data Privacy Team, New Jersey, United States. We respond to all privacy inquiries within 5 business days.`,
  },
];

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-gray-500">
            Effective: January 1, 2025 · Last updated: June 1, 2025
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            This Privacy Policy explains how BlackDrivo collects, uses, and protects your personal
            data when you use our platform. We take your privacy seriously and are committed to
            being transparent about our practices.
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
                <p className="text-sm font-semibold text-gray-900">Privacy questions or data requests?</p>
                <p className="mt-1 text-sm text-gray-600">
                  Email{" "}
                  <a href="mailto:privacy@blackdrivo.com" className="font-medium text-[#0b66d1] hover:underline">
                    privacy@blackdrivo.com
                  </a>{" "}
                  — we respond within 5 business days.
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
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Accessibility",    href: "/accessibility"    },
            { label: "Help Center",      href: "/help"             },
            { label: "Contact Us",       href: "/contact"          },
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
