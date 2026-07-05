import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, Shield, Clock, Users, Star, Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drive for BlackDrivo | Chauffeur & Black Car Jobs NYC, NJ, Philadelphia",
  description:
    "Join the BlackDrivo elite fleet. We are hiring professional chauffeurs and owner-operators in NYC, New Jersey, and Philadelphia. Premium clientele, 24/7 dispatch, competitive pay. Apply today.",
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
    icon: Briefcase,
    title: "Late-Model Fleet",
    description:
      "Take the wheel of a luxury fleet designed to match the professionalism, comfort, and service standards BlackDrivo is known for.",
  },
];

const steps = [
  {
    num: "01",
    title: "Submit Your Application",
    desc: "Submit your basic details and professional driving experience through the form below.",
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
    desc: "Qualified candidates are invited to complete onboarding and join the BlackDrivo chauffeur network.",
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
    a: "We offer highly competitive rates with weekly payments. Company chauffeurs receive a stable base pay plus performance bonuses. Owner-operators benefit from our high-volume dispatch and transparent earning reports.",
  },
  {
    q: "Do I keep my tips?",
    a: "Absolutely. Chauffeurs retain 100% of all gratuities provided by clients.",
  },
  {
    q: "What vehicles are in the fleet?",
    a: "Our fleet consists of late-model luxury sedans (Mercedes-Benz S580, Lincoln Continental, Volvo S90), premium SUVs (Cadillac Escalade, Chevrolet Suburban), and Executive Sprinter vans. All vehicles are meticulously maintained and equipped with the latest technology.",
  },
  {
    q: "Who covers fuel and maintenance?",
    a: "For Company Chauffeurs, BlackDrivo covers 100% of fuel, insurance, and maintenance expenses. Owner-operators are responsible for their own vehicle costs, though we offer access to discounted fleet insurance and maintenance partners.",
  },
  {
    q: "Can I choose my own schedule?",
    a: "We offer various shifts, including morning, evening, and weekend rotations. Our system allows you to plan your schedule in advance, focusing on high-demand periods like airport transfers and VIP corporate events to maximize your earnings.",
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

export default function DrivePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src="/el-hero-bg.webp"
          alt="BlackDrivo Chauffeur"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,15,26,0.25) 0%, rgba(10,15,26,0.70) 55%, rgba(10,15,26,0.95) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
          <h1 className="font-['Georgia',serif] text-5xl font-bold leading-tight text-white md:text-7xl">
            Elevate Your Career.<br />Drive with BlackDrivo.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Leave the ordinary behind and step into a career that respects your professionalism.
            Gain access to premium clientele, consistent high-end volume, and 24/7 dispatch support
            across NYC, New Jersey, and Philadelphia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
            >
              <Phone className="h-4 w-4" /> Call 24/7
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {[
              { value: "24/7",  label: "Dispatch Support" },
              { value: "100%",  label: "Tips Yours to Keep" },
            ].map((s) => (
              <div key={s.label} className="bg-black/30 px-6 py-4 backdrop-blur-sm">
                <p className="text-xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The BlackDrivo Advantage */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              The BlackDrivo Advantage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
              We are seeking top-tier company chauffeurs and owner-operators who demand the best —
              flexible opportunities for both, based on service area, availability, and current demand.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((a) => (
              <div key={a.title} className="border border-gray-100 bg-white p-8 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md">
                <a.icon className="mb-4 h-7 w-7 text-[#0b66d1]" />
                <h3 className="font-['Georgia',serif] text-lg font-bold text-gray-900">{a.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet teaser */}
      <section className="bg-gray-950 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">The BlackDrivo Fleet</p>
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
              { src: "/drive-image71.webp", name: "Mercedes-Benz Sprinter", type: "Executive Mini-Bus"      },
            ].map((v) => (
              <div key={v.name} className="group bg-gray-900 border border-white/10">
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
            <Link href="/fleet" className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white">
              View Full Fleet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Choose the Path That Fits You</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              Your Journey Starts Here
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Company Chauffeur */}
            <div className="border border-gray-100 bg-white p-10 shadow-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">Option 1</p>
              <h3 className="font-['Georgia',serif] text-3xl font-bold text-gray-900">Drive with BlackDrivo</h3>
              <p className="mt-4 text-sm leading-7 text-gray-500">
                Join a professional chauffeur team trusted to serve executive, corporate, and VIP
                travelers. Company Chauffeur opportunities are available for qualified drivers who
                take pride in polished service, safe transportation, and a consistently elevated
                passenger experience.
              </p>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-400">Available in</p>
              <div className="mt-2 flex gap-2">
                <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">New York City</span>
                <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">New Jersey</span>
                <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">Philadelphia</span>
              </div>
              <ul className="mt-7 space-y-2.5">
                {[
                  "Valid driver's license (TLC required in NYC)",
                  "Clean driving record",
                  "Professional appearance and communication",
                  "Exceptional customer service",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" /> {r}
                  </li>
                ))}
              </ul>
              <a href="#apply" className="mt-8 inline-flex items-center gap-2 bg-[#0b66d1] px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]">
                Apply as Chauffeur <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Owner-Operator */}
            <div className="border border-gray-100 bg-gray-50 p-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">Option 2</p>
              <h3 className="font-['Georgia',serif] text-3xl font-bold text-gray-900">Partner with BlackDrivo</h3>
              <p className="mt-4 text-sm leading-7 text-gray-500">
                Partner with us to maximize your vehicle's earning potential. Gain exclusive access
                to high-volume corporate and VIP travel routes. Owner-operators benefit from our
                high-volume dispatch, transparent earning reports, and a professional network
                built over years in the luxury transportation business.
              </p>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-400">Available in</p>
              <div className="mt-2 flex gap-2">
                <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">New York City</span>
                <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">New Jersey</span>
                <span className="rounded bg-[#0b66d1]/10 px-3 py-1.5 text-xs font-bold text-[#0b66d1]">Philadelphia</span>
              </div>
              <ul className="mt-7 space-y-2.5">
                {[
                  "Late-model luxury vehicle (sedan, SUV, or van)",
                  "Commercial insurance",
                  "Professional licensing",
                  "Clean driving history",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" /> {r}
                  </li>
                ))}
              </ul>
              <a href="#apply" className="mt-8 inline-flex items-center gap-2 border border-gray-900 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-900 transition hover:bg-gray-900 hover:text-white">
                Apply as Partner <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Simple Process</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              The Application & Onboarding Process
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="bg-white border border-gray-100 p-8 shadow-sm">
                <p className="mb-4 text-4xl font-extrabold text-[#0b66d1]/20">{s.num}</p>
                <h3 className="font-['Georgia',serif] text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
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

      {/* Apply Form */}
      <section id="apply" className="border-t border-gray-100 bg-gray-950 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Join the Fleet</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-white md:text-5xl">
              Apply to Join BlackDrivo
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/50">
              Submit your information below and tell us about your experience and availability.
              Our team will review your application and contact you if there is a suitable opportunity.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">First Name</label>
                <input type="text" placeholder="John" className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#0b66d1] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">Last Name</label>
                <input type="text" placeholder="Smith" className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#0b66d1] focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">Email</label>
              <input type="email" placeholder="john@example.com" className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#0b66d1] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">Phone</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#0b66d1] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">I am applying as</label>
              <select className="w-full border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white focus:border-[#0b66d1] focus:outline-none">
                <option value="">Select an option</option>
                <option value="chauffeur">Company Chauffeur</option>
                <option value="owner-operator">Owner-Operator / Partner</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">Service Area</label>
              <select className="w-full border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white focus:border-[#0b66d1] focus:outline-none">
                <option value="">Select your area</option>
                <option value="nyc">New York City</option>
                <option value="nj">New Jersey</option>
                <option value="philly">Philadelphia</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">Years of Experience</label>
              <input type="text" placeholder="e.g. 3 years as TLC chauffeur" className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#0b66d1] focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/50">Tell us about yourself</label>
              <textarea rows={4} placeholder="Share your experience, vehicle type (if owner-operator), and why you want to join BlackDrivo..." className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#0b66d1] focus:outline-none resize-none" />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0b66d1] py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Submit Application
            </button>
            <p className="text-center text-xs text-white/30">
              Questions? Call us at{" "}
              <a href="tel:+18005550199" className="text-[#0b66d1] hover:underline">
                1 (800) 555-0199
              </a>
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
