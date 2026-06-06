import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { blogPosts, categories } from "@/lib/data/blog-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | BlackDrivo — Premium Chauffeur & Black Car Service Insights",
  description: "Expert guides on airport transfers, corporate travel, vehicle selection, and luxury ground transportation across NYC and New Jersey. Practical tips from the BlackDrivo team.",
  keywords: "black car service blog, chauffeur tips, airport transfer guide, NYC car service, corporate travel tips, luxury transportation",
  openGraph: {
    title: "BlackDrivo Blog — Chauffeur & Premium Ground Transportation Insights",
    description: "Practical guides, expert tips, and destination knowledge for premium travelers in NYC, New Jersey, and beyond.",
    type: "website",
  },
};

const featured = blogPosts.find(p => p.featured) ?? blogPosts[0];
const rest      = blogPosts.filter(p => !p.featured);

const categoryColors: Record<string, string> = {
  "Airport Transfers": "bg-blue-50 text-[#0b66d1]",
  "Corporate Travel":  "bg-gray-900 text-white",
  "Service Guide":     "bg-purple-50 text-purple-700",
  "Travel Tips":       "bg-emerald-50 text-emerald-700",
  "Events":            "bg-amber-50 text-amber-700",
};

function getCategoryClass(cat: string) {
  return categoryColors[cat] ?? "bg-gray-100 text-gray-700";
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-4 pb-12 pt-32 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
              BlackDrivo Journal
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Premium travel,<br className="hidden sm:block" /> expertly explained.
            </h1>
            <p className="mt-4 text-base text-gray-500 md:text-lg">
              Airport guides, corporate travel strategies, vehicle advice, and destination
              knowledge — from the team that moves thousands of riders every month.
            </p>
          </div>
          {/* Category pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat}
                className={`rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium transition hover:border-[#0b66d1] hover:text-[#0b66d1] cursor-default ${
                  cat === "All" ? "border-[#0b66d1] text-[#0b66d1]" : "text-gray-600"
                }`}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured post */}
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-lg md:grid-cols-2">
            <div className="relative h-64 md:h-auto">
              <Image src={featured.image} alt={featured.title} fill
                className="object-cover transition group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
              <span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryClass(featured.category)}`}>
                {featured.category}
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
              <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
                Featured
              </span>
              <h2 className="text-2xl font-bold leading-snug text-gray-900 group-hover:text-[#0b66d1] transition md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-500 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featured.readTime}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-[#0b66d1] transition group-hover:gap-2">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Post grid */}
      <section className="px-4 pb-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Latest articles</h2>
            <span className="text-sm text-gray-400">{blogPosts.length} articles</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-[#0b66d1]/20 hover:shadow-md">
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryClass(post.category)}`}>
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="flex-1 text-base font-semibold leading-snug text-gray-900 group-hover:text-[#0b66d1] transition">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#0b66d1] px-8 py-12 text-center md:px-16">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to experience the difference?
          </h2>
          <p className="mt-3 text-base text-white/70">
            Book a premium chauffeur in minutes — fixed prices, professional drivers, zero surprises.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0b66d1] transition hover:bg-blue-50">
              Book a ride <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10">
              Our services <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
