"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <section className="min-h-screen bg-[#0b1117] px-6 py-16 text-slate-100 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          Back to home
        </Link>
        <h1 className="mt-4 text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          This Privacy Policy describes how BlackDrivo collects and uses personal
          information when you book or request chauffeured transportation services in
          the United States.
        </p>

        <div className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-[#111a23] p-8">
          <div>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              We collect details needed to complete your ride request, including contact
              information, pickup and drop-off locations, booking preferences, and payment
              related information.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. How We Use Information</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              We use your data to process bookings, provide customer support, improve ride
              quality, and communicate important ride updates such as confirmations and
              schedule changes.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. Data Sharing</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              We share necessary booking details only with operational partners required to
              fulfill your ride. We do not sell your personal data to third parties.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">4. Data Security</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              We implement technical and organizational safeguards designed to protect
              personal information against unauthorized access, misuse, or disclosure.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">5. Contact</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              For privacy-related questions, contact us at support@blackdrivo.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
