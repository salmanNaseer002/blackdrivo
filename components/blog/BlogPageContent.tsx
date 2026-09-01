"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock, ChevronRight } from "lucide-react";
import { blogPosts } from "@/lib/data/blog-posts";
import AdSlot from "@/components/shared/AdSlot";

export default function BlogPageContent() {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");

  const regionPosts = blogPosts.filter(p => (isPk ? p.country === "PK" : p.country !== "PK"));
  const featured = regionPosts.find(p => p.featured) ?? regionPosts[0];
  const rest      = regionPosts.filter(p => p.slug !== featured?.slug);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-4 pb-12 pt-32 md:pt-44">
        <div className="mx-auto max-w-[1600px]">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Premium travel,<br className="hidden sm:block" /> expertly explained.
            </h1>
            <p className="mt-4 text-base text-gray-500 md:text-lg">
              {isPk
                ? "Airport guides, corporate travel strategies, vehicle advice, and city-to-city knowledge — from the team that moves riders across Lahore, Karachi, and Islamabad every day."
                : "Airport guides, corporate travel strategies, vehicle advice, and destination knowledge — from the team that moves thousands of riders every month."}
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <>
          {/* Featured post */}
          <section className="px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-[1600px]">
              <Link href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-[2rem] bg-white transition hover:bg-blue-50 md:grid-cols-2">
                <div className="relative h-64 overflow-hidden rounded-2xl md:h-auto">
                  <Image src={featured.image} alt={featured.title} fill
                    className="object-cover transition group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" priority />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12">
                  <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
                    Featured — {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold leading-snug text-gray-900 transition md:text-3xl">
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

          <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8">
            <AdSlot label="Advertisement" />
          </div>
        </>
      )}

      {/* Post grid */}
      <section className="px-4 pb-20 pt-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Latest articles</h2>
            <span className="text-sm text-gray-400">{regionPosts.length} articles</span>
          </div>

          {rest.length === 0 ? (
            <p className="text-sm text-gray-500">More articles for this region are on the way — check back soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group rounded-[2rem] p-3 transition-colors duration-300 hover:bg-blue-50"
                >
                  <div className="relative h-48 overflow-hidden rounded-2xl bg-gray-100">
                    <Image src={post.image} alt={post.title} fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div className="mt-6 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#0b66d1]">{post.category}</p>
                    <h3 className="text-lg font-bold leading-snug text-gray-900">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{post.readTime}
                      </span>
                      <span>·</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#0b66d1] px-8 py-12 text-center md:px-16">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to experience the difference?
          </h2>
          <p className="mt-3 text-base text-white/70">
            Book a premium {isPk ? "driver" : "chauffeur"} in minutes — fixed prices, professional drivers, zero surprises.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={isPk ? "/pk/#book" : "/#book"}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0b66d1] transition hover:bg-blue-50">
              Book a ride <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={isPk ? "/pk/services" : "/services"}
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
