import { headers } from "next/headers";
import BlogPageContent from "@/components/blog/BlogPageContent";
import { blogPosts } from "@/lib/data/blog-posts";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const isPk = (await headers()).get("x-region") === "pk";
  if (isPk) {
    return {
      title: "Blog | BlackDrivo Pakistan — Car Rental & Driver Service Insights",
      description: "Expert guides on airport pickup & drop, corporate travel, vehicle selection, and ground transportation across Lahore, Karachi, and Islamabad. Practical tips from the BlackDrivo team.",
      keywords: "car rental blog Pakistan, driver service tips, airport pickup guide, Lahore car service, corporate travel tips Pakistan",
      alternates: { canonical: "https://www.blackdrivo.com/pk/blog" },
      openGraph: {
        title: "BlackDrivo Pakistan Blog — Driver & Ground Transportation Insights",
        description: "Practical guides, expert tips, and destination knowledge for travelers in Lahore, Karachi, Islamabad, and beyond.",
        type: "website",
      },
    };
  }
  return {
    title: "Blog | BlackDrivo — Premium Chauffeur & Black Car Service Insights",
    description: "Expert guides on airport transfers, corporate travel, vehicle selection, and luxury ground transportation across NYC and New Jersey. Practical tips from the BlackDrivo team.",
    keywords: "black car service blog, chauffeur tips, airport transfer guide, NYC car service, corporate travel tips, luxury transportation",
    alternates: { canonical: "https://www.blackdrivo.com/blog" },
    openGraph: {
      title: "BlackDrivo Blog — Chauffeur & Premium Ground Transportation Insights",
      description: "Practical guides, expert tips, and destination knowledge for premium travelers in NYC, New Jersey, and beyond.",
      type: "website",
    },
  };
}

export default async function BlogPage() {
  const isPk = (await headers()).get("x-region") === "pk";
  const base = isPk ? "https://www.blackdrivo.com/pk" : "https://www.blackdrivo.com";
  const regionPosts = blogPosts.filter(p => (isPk ? p.country === "PK" : p.country !== "PK"));

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: isPk ? "BlackDrivo Pakistan Blog" : "BlackDrivo Blog",
    url: `${base}/blog`,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "BlackDrivo",
      logo: { "@type": "ImageObject", url: "https://www.blackdrivo.com/logo%20bb.png" },
    },
    blogPost: regionPosts.map(p => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: `${base}/blog/${p.slug}`,
      datePublished: p.date,
      image: p.image,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <BlogPageContent />
    </>
  );
}
