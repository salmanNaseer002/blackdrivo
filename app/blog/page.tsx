import { headers } from "next/headers";
import BlogPageContent from "@/components/blog/BlogPageContent";
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

export default function BlogPage() {
  return <BlogPageContent />;
}
