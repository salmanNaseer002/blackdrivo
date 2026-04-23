"use client";

import Link from "next/link";

const vehicleTypes = [
  {
    name: "Business Class",
    seats: "Up to 3 passengers",
    bags: "2 checked + 2 carry-on",
    description: "Ideal for solo travelers and executive airport transfers.",
  },
  {
    name: "SUV Class",
    seats: "Up to 6 passengers",
    bags: "5 checked + 3 carry-on",
    description: "Premium space and comfort for families and group travel.",
  },
  {
    name: "First Class",
    seats: "Up to 3 passengers",
    bags: "2 checked + 2 carry-on",
    description: "Top-tier luxury for VIP transportation and special occasions.",
  },
];

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#0b1117] text-slate-100">
      <header className="border-b border-white/10 bg-[#0b1117]">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            BlackDrivo
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-white/10 bg-[#111a23] p-6 md:p-8">
            <h1 className="text-3xl font-semibold md:text-4xl">Book your ride</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Build your United States trip with airport pickup, hourly service, or city-to-city
              transfer in a few steps.
            </p>

            <div className="mt-6 grid gap-3 text-sm md:grid-cols-3">
              <button
                type="button"
                className="rounded-lg bg-[#f6b73c] px-4 py-2.5 font-semibold text-slate-950"
              >
                One way
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/20 px-4 py-2.5 font-semibold"
              >
                By the hour
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/20 px-4 py-2.5 font-semibold"
              >
                City to city
              </button>
            </div>

            <form className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="Pickup location"
                />
                <input
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="Drop-off location"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="date"
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                />
                <input
                  type="time"
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                />
                <input
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="Passengers"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="First name"
                />
                <input
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="Last name"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="Email address"
                />
                <input
                  type="tel"
                  className="w-full rounded-xl border border-white/15 bg-[#0b1117] px-4 py-3 text-sm outline-none ring-[#f6b73c] focus:ring-2"
                  placeholder="Phone number"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#f6b73c] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#f4c766]"
              >
                Continue to payment
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111a23] p-6">
              <h2 className="text-xl font-semibold">Why choose BlackDrivo</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>Professional US-based chauffeur network</li>
                <li>Flight tracking and punctual airport pickups</li>
                <li>Corporate invoicing and priority support</li>
                <li>Transparent fare before confirmation</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111a23] p-6">
              <h2 className="text-xl font-semibold">Vehicle classes</h2>
              <div className="mt-4 space-y-4">
                {vehicleTypes.map((vehicle) => (
                  <article
                    key={vehicle.name}
                    className="rounded-xl border border-white/10 bg-[#0b1117] p-4"
                  >
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {vehicle.seats} - {vehicle.bags}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{vehicle.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
