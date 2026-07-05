import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Download, Mail, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press & Media | BlackDrivo",
  description: "Press resources, media coverage, and contact information for BlackDrivo — premium black car service across the tri-state area.",
};

const coverage = [
  {
    publication: "Forbes",
    logo: "Forbes",
    date: "March 2025",
    headline: "How BlackDrivo is Redefining Premium Ground Transportation in the Tri-State Area",
    category: "Business",
    href: "#",
  },
  {
    publication: "The Wall Street Journal",
    logo: "WSJ",
    date: "January 2025",
    headline: "BlackDrivo's Tech-First Approach to Luxury Chauffeur Service Gains Traction",
    category: "Technology",
    href: "#",
  },
  {
    publication: "TechCrunch",
    logo: "TC",
    date: "November 2024",
    headline: "BlackDrivo Raises Series A to Expand Its On-Demand Chauffeur Platform",
    category: "Funding",
    href: "#",
  },
  {
    publication: "Business Insider",
    logo: "BI",
    date: "September 2024",
    headline: "Inside the Startup Disrupting Executive Transportation One Ride at a Time",
    category: "Profile",
    href: "#",
  },
  {
    publication: "NJ Business Journal",
    logo: "NJ",
    date: "July 2024",
    headline: "New Jersey's BlackDrivo Makes Premium Car Service Accessible to All Travelers",
    category: "Local Business",
    href: "#",
  },
  {
    publication: "Travel + Leisure",
    logo: "T+L",
    date: "May 2024",
    headline: "The Best Black Car Services in New York and New Jersey, Ranked",
    category: "Travel",
    href: "#",
  },
];

const stats = [
  { value: "50K+",  label: "Rides completed"      },
  { value: "500+",  label: "Active chauffeurs"     },
  { value: "4.9★",  label: "Average rider rating"  },
  { value: "30+",   label: "Markets served"        },
];

const assets = [
  { name: "Brand Guidelines",    size: "PDF  —  2.4 MB",   icon: "📐" },
  { name: "Logo Pack (SVG/PNG)", size: "ZIP  —  1.1 MB",   icon: "🎨" },
  { name: "Product Screenshots", size: "ZIP  —  8.7 MB",   icon: "📸" },
  { name: "Executive Bio & Photo", size: "PDF  —  3.2 MB", icon: "👤" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 pb-16 pt-32 md:pt-44">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-24 h-96 w-96 rounded-full bg-blue-50 blur-3xl opacity-50" />
          <div className="absolute right-1/3 top-40 h-64 w-64 rounded-full bg-blue-50/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            BlackDrivo in the news
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base text-gray-500 md:text-lg">
            Latest coverage, brand assets, and press contact information for journalists
            and media professionals.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="mailto:press@blackdrivo.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
              <Mail className="h-4 w-4" /> Press inquiries
            </a>
            <a href="#assets"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-7 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
              <Download className="h-4 w-4" /> Media kit
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900 md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Press coverage */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">Coverage</p>
            <h2 className="text-3xl font-bold text-gray-900">Recent press</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {coverage.map(item => (
              <a key={item.headline} href={item.href}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#0b66d1]/20 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 items-center rounded-lg bg-gray-900 px-3">
                    <span className="text-xs font-bold tracking-wide text-white">{item.logo}</span>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-[#0b66d1]">
                    {item.category}
                  </span>
                </div>
                <p className="mt-4 flex-1 text-base font-semibold leading-snug text-gray-900 group-hover:text-[#0b66d1] transition">
                  {item.headline}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1 text-[#0b66d1] opacity-0 transition group-hover:opacity-100">
                    Read article <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Media kit */}
      <section id="assets" className="border-t border-gray-100 bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Media kit</h2>
            <p className="mt-3 text-base text-gray-500">
              Official logos, brand guidelines, and executive materials for editorial use.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {assets.map(asset => (
              <div key={asset.name}
                className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{asset.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{asset.name}</p>
                    <p className="text-xs text-gray-500">{asset.size}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press contact */}
      <section className="px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 ">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Get in touch</h2>
              <p className="mt-4 text-base text-gray-500">
                For interview requests, fact-checking, or embargoed materials, our communications
                team responds within 4 business hours.
              </p>
              <div className="mt-6 space-y-3">
                <a href="mailto:press@blackdrivo.com"
                  className="flex items-center gap-3 text-sm font-medium text-gray-900 hover:text-[#0b66d1]">
                  <Mail className="h-4 w-4 text-[#0b66d1]" /> press@blackdrivo.com
                </a>
                <p className="text-sm text-gray-500">Response time: within 4 business hours</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/about"
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-900 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                About BlackDrivo <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
              </Link>
              <a href="mailto:press@blackdrivo.com"
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-900 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                Request an interview <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
              </a>
              <a href="#assets"
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-900 transition hover:border-[#0b66d1]/30 hover:bg-blue-50">
                Download brand assets <ArrowRight className="h-4 w-4 text-[#0b66d1]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
