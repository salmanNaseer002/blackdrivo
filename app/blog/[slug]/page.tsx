import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/data/blog-posts";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found | BlackDrivo Blog" };

  return {
    title: `${post.title} | BlackDrivo Blog`,
    description: post.excerpt,
    keywords: post.seoKeywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

const categoryColors: Record<string, string> = {
  "Airport Transfers": "bg-blue-50 text-[#0b66d1]",
  "Corporate Travel":  "bg-gray-900 text-white",
  "Service Guide":     "bg-purple-50 text-purple-700",
  "Travel Tips":       "bg-emerald-50 text-emerald-700",
  "Events":            "bg-amber-50 text-amber-700",
};

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category, 3);
  const catClass = categoryColors[post.category] ?? "bg-gray-100 text-gray-700";

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "BlackDrivo",
      logo: { "@type": "ImageObject", url: "https://blackdrivo.com/logo bb.png" },
    },
    mainEntityOfPage: { "@type": "WebPage" },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Hero image */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden pt-16 md:h-[60vh]">
        <Image src={post.image} alt={post.title} fill
          className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 md:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <span className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${catClass}`}>
              {post.category}
            </span>
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">

            {/* Main content */}
            <article>
              {/* Meta */}
              <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6">
                <Link href="/blog"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900">
                  <ArrowLeft className="h-4 w-4" /> Blog
                </Link>
                <span className="text-gray-200">|</span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="h-4 w-4" /> {post.readTime}
                </span>
                <span className="text-gray-200">|</span>
                <span className="text-sm text-gray-500">{post.date}</span>
                <span className="text-gray-200">|</span>
                <span className="text-sm text-gray-500">By {post.author}</span>
              </div>

              {/* Lead */}
              <p className="mb-10 text-xl font-medium leading-8 text-gray-700">
                {post.excerpt}
              </p>

              {/* Sections */}
              <div className="space-y-10">
                {post.sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
                      {section.heading}
                    </h2>
                    <p className="text-base leading-8 text-gray-600">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA inline */}
              <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-6 md:px-8">
                <h3 className="text-lg font-bold text-gray-900">
                  Ready to book your next ride?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Fixed prices, professional chauffeurs, flight tracking included.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/booking"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0b66d1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]">
                    Book a ride <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]">
                    Get a quote
                  </Link>
                </div>
              </div>

              {/* Author */}
              <div className="mt-10 flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b66d1] text-sm font-bold text-white">
                  BD
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.authorRole} · BlackDrivo</p>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="mt-12 lg:mt-0">
              <div className="sticky top-24 space-y-6">

                {/* Quick links */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    In this article
                  </p>
                  <nav className="space-y-2">
                    {post.sections.map((s, i) => (
                      <p key={i} className="text-xs leading-snug text-gray-600">
                        {i + 1}. {s.heading}
                      </p>
                    ))}
                  </nav>
                </div>

                {/* Book CTA */}
                <div className="rounded-2xl bg-[#0b66d1] p-5 text-white">
                  <p className="text-sm font-bold">Book your ride</p>
                  <p className="mt-1 text-xs text-white/70">
                    Fixed fares · Professional drivers · 24/7
                  </p>
                  <Link href="/booking"
                    className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-semibold text-[#0b66d1] transition hover:bg-blue-50">
                    Book now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Services */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Our services
                  </p>
                  {[
                    { label: "Airport Transfers",  href: "/services#airport"   },
                    { label: "Hourly Chauffeur",   href: "/services#hourly"    },
                    { label: "City-to-City Rides", href: "/services#city"      },
                    { label: "Corporate Travel",   href: "/services#corporate" },
                    { label: "Event Transport",    href: "/services#events"    },
                  ].map(s => (
                    <Link key={s.href} href={s.href}
                      className="flex items-center justify-between py-2 text-sm text-gray-700 transition hover:text-[#0b66d1]">
                      {s.label}
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50 px-4 py-16 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Related articles</h2>
              <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-[#0b66d1] hover:underline">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(rPost => (
                <Link key={rPost.slug} href={`/blog/${rPost.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative h-44 overflow-hidden">
                    <Image src={rPost.image} alt={rPost.title} fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw" />
                  </div>
                  <div className="p-5">
                    <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[rPost.category] ?? "bg-gray-100 text-gray-700"}`}>
                      {rPost.category}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-[#0b66d1] transition">
                      {rPost.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />{rPost.readTime}
                      <span>·</span>{rPost.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
