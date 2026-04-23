"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <section className="min-h-screen bg-[#0b1117] px-6 py-16 text-slate-100 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          Back to home
        </Link>
        <h1 className="mt-4 text-4xl font-semibold">Terms of Service</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          These Terms of Service govern your use of BlackDrivo and apply to ride requests,
          bookings, and related transportation support services in the United States.
        </p>

        <div className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-[#111a23] p-8">
          <div>
            <h2 className="text-xl font-semibold">1. Service Scope</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              BlackDrivo connects customers with premium chauffeured transportation options
              for airport transfers, hourly service, and city-to-city travel.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Booking and Payments</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              By placing a booking, you agree to provide accurate ride details and payment
              information. Quoted fares may vary based on route, waiting time, tolls, and
              special requests.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. Cancellations</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Cancellation terms depend on the selected ride type and notice period before
              pickup. Exact cancellation rules are presented at booking confirmation.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">4. Customer Responsibilities</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Customers are responsible for providing correct pickup information, complying
              with local laws, and treating chauffeurs and vehicles respectfully.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">5. Liability</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              BlackDrivo is not responsible for delays caused by weather, traffic, flight
              disruptions, or events beyond reasonable control. Liability is limited to the
              extent allowed by applicable law.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
