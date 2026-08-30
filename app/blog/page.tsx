import BlogPageContent from "@/components/blog/BlogPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
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

export default function BlogPage() {
  return <BlogPageContent />;
}
