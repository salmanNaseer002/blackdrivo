import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, Clock, Users, Star, DollarSign } from "lucide-react";
import DriverHeroSlider from "@/components/driver/DriverHeroSlider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drive for BlackDrivo | Chauffeur & Black Car Jobs NYC, NJ, Philadelphia",
  description:
    "Join the BlackDrivo elite fleet. We are hiring professional chauffeurs in NYC, New Jersey, and Philadelphia. Premium clientele, 24/7 dispatch, competitive pay. Apply today.",
};

const advantages = [
  {
    icon: Users,
    title: "Premium Clientele",
    description:
      "Access opportunities to serve corporate travelers, VIP guests, airport transfers, private aviation clients, and high-end transportation requests.",
  },
  {
    icon: Clock,
    title: "24/7 Dispatch Support",
    description:
      "Work with an experienced operations team focused on coordination, trip details, and a smooth experience from assignment to completion.",
  },
  {
    icon: Star,
    title: "Elite Reputation",
    description:
      "Be part of a professional chauffeur team known for executive clientele, elevated standards, and a service culture that sets us apart.",
  },
  {
    icon: DollarSign,
    title: "Premium Earnings",
    description:
      "Earn significantly more than standard rideshare apps. Fixed-rate bookings, weekly direct deposit, and 100% of all tips are yours to keep.",
  },
];

const steps = [
  {
    num: "01",
    title: "Submit Your Application",
    desc: "Submit your basic details and professional driving experience through our driver application.",
  },
  {
    num: "02",
    title: "Application Review",
    desc: "Our team reviews applications based on current coverage needs and candidate qualifications.",
  },
  {
    num: "03",
    title: "Screening & Next Steps",
    desc: "If your profile is a potential fit, we will contact you to discuss next steps and required screening.",
  },
  {
    num: "04",
    title: "Onboarding",
    desc: "Qualified candidates complete onboarding and join the BlackDrivo chauffeur network.",
  },
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

const faqs = [
  {
    q: "What licenses and documents are required?",
    a: "All candidates must possess a valid driver's license and a clean driving record. In New York City, a TLC license is required. In New Jersey and Philadelphia, professional driving experience is preferred. All candidates must pass a rigorous background check and complete our BlackDrivo Standard training.",
  },
  {
    q: "Is there a dress code?",
    a: "Yes. As a premium service, our chauffeurs are required to maintain a professional appearance at all times — typically a dark, well-tailored suit, white shirt, and tie — reflecting the elite nature of our brand.",
  },
  {
    q: "How does the pay structure work?",
    a: "We offer highly competitive rates with weekly payments. Company chauffeurs receive a stable base pay plus performance bonuses.",
  },
  {
    q: "Do I keep my tips?",
    a: "Absolutely. Chauffeurs retain 100% of all gratuities provided by clients.",
  },
  {
    q: "Can I choose my own schedule?",
    a: "We offer various shifts including morning, evening, and weekend rotations. Our system allows you to plan your schedule in advance, focusing on high-demand periods like airport transfers and VIP corporate events.",
  },
  {
    q: "What support do I have on the road?",
    a: "You are never alone. Our expert dispatch team is available 24/7 to assist with navigation, client changes, or any roadside emergencies. You focus on the drive — we handle the logistics.",
  },
  {
    q: "How is this different from ride-sharing?",
    a: "Unlike ride-sharing, BlackDrivo provides a stable, high-volume environment with a pre-vetted, premium clientele. You won't be competing with thousands of other drivers for a single ride. We offer a career path, a professional community, and a level of respect that only an elite executive service can provide.",
  },
];

export default function DriverLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero — full-screen image slider */}
      <DriverHeroSlider />

      {/* The BlackDrivo Advantage */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">
              Why Chauffeurs Choose BlackDrivo
            </p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              The BlackDrivo Advantage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
              We are seeking top-tier company chauffeurs who demand the best — flexible
              opportunities based on service area, availability, and current demand.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a) => (
              <div
                key={a.title}
                className="border border-gray-100 bg-white p-8 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md"
              >
                <a.icon className="mb-4 h-7 w-7 text-[#0b66d1]" />
                <h3 className="font-['Georgia',serif] text-lg font-bold text-gray-900">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet teaser — dark */}
      <section className="bg-gray-950 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">
              The BlackDrivo Fleet
            </p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl">
              Step into Your New Corner Office.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/55">
              Every vehicle is a late-model luxury machine, meticulously maintained and equipped
              with the latest technology. You drive the best — because our clients deserve the best.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { src: "/image-76.webp",     name: "Mercedes-Benz S580",    type: "Executive Luxury Sedan" },
              { src: "/suv-2.jpg",          name: "Cadillac Escalade",      type: "Executive Luxury SUV"   },
              { src: "/drive-image71.webp", name: "Mercedes-Benz Sprinter", type: "Executive Mini-Bus"     },
            ].map((v) => (
              <div key={v.name} className="group border border-white/10 bg-gray-900">
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gray-800 p-4">
                  <Image
                    src={v.src}
                    alt={v.name}
                    fill
                    className="object-contain p-3 transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-['Georgia',serif] text-base font-bold text-white">{v.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">{v.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
            >
              View Full Fleet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Drive with BlackDrivo */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">
              Join the Fleet
            </p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              Drive with BlackDrivo
            </h2>
          </div>
          <div className="border border-gray-100 bg-white p-10 shadow-sm">
            <p className="text-sm leading-7 text-gray-500">
              Join a professional chauffeur team trusted to serve executive, corporate, and VIP
              travelers. Company Chauffeur opportunities are available for qualified drivers who
              take pride in polished service, safe transportation, and a consistently elevated
              passenger experience.
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-400">Available in</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">New York City</span>
              <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">New Jersey</span>
              <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">Philadelphia</span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Valid driver's license (TLC required in NYC)",
                "Clean driving record",
                "Professional appearance and communication",
                "Exceptional customer service",
                "Ability to pass a rigorous background check",
                "Commitment to the BlackDrivo Standard",
              ].map((r) => (
                <div key={r} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" /> {r}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/driver/signup"
                className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-gray-300 px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-gray-700"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Simple Process</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              The Application &amp; Onboarding Process
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="border border-gray-100 bg-white p-8 shadow-sm">
                <p className="mb-4 text-4xl font-extrabold text-[#0b66d1]/20">{s.num}</p>
                <h3 className="font-['Georgia',serif] text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/driver/signup"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Start Your Application <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Earnings */}
      <section
        className="bg-[#0b66d1] px-4 py-20 md:px-6 lg:px-8"
        style={{ backgroundImage: "linear-gradient(135deg, #0b66d1 0%, #0952a8 100%)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                Earning Potential
              </p>
              <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl">
                Average drivers earn<br />
                <span className="text-white/90">$2,800–$4,500/month</span>
              </h2>
              <p className="mt-5 text-base leading-7 text-white/70">
                Our premium fixed-rate model means you know exactly what you're earning before
                every ride. No surge pricing tricks — just consistent, high-quality income.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Fixed fares — no surprises",
                  "Weekly direct deposit",
                  "100% of all tips are yours",
                  "Bonuses for top-rated drivers",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                    <CheckCircle className="h-4 w-4 shrink-0 text-white" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/driver/signup"
                className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-[#0b66d1] transition hover:bg-gray-100"
              >
                Apply to Drive <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Airport Transfer",  earn: "$85–$185",          note: "Per trip"         },
                { label: "City-to-City",      earn: "$200–$480",         note: "Per trip"         },
                { label: "Hourly Service",    earn: "$55–$90",           note: "Per hour"         },
                { label: "Corporate Account", earn: "Priority dispatch",  note: "Recurring income" },
              ].map((item) => (
                <div key={item.label} className="border border-white/20 bg-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{item.earn}</p>
                  <p className="text-xs text-white/50">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Driver Testimonials */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Driver Stories</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              Hear from our drivers
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {driverTestimonials.map((t) => (
              <div key={t.name} className="border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
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

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">FAQ</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900">
              Common Questions
            </h2>
          </div>
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <span className="mt-0.5 shrink-0 text-[#0b66d1] transition group-open:rotate-45">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-gray-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-950 px-4 py-20 text-center md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Join the Fleet</p>
          <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl">
            Ready to start earning?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-white/60">
            Join professional chauffeurs who have made BlackDrivo their primary income source.
            Applications take 10 minutes. Approvals within 2–3 business days.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/driver/signup"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Apply to Drive <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
            >
              <Phone className="h-4 w-4" /> Call 24/7
            </a>
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
