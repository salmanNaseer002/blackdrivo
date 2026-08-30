import HomePageContent from "@/components/home/HomePageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlackDrivo Pakistan — Premium Driver Service in Lahore, Karachi & Islamabad",
  description:
    "BlackDrivo is now available across Pakistan — premium driver and black car service in Lahore, Karachi, and Islamabad. Fixed pricing, professional drivers, airport transfers, and hourly rentals.",
  keywords: [
    "driver service Pakistan",
    "black car service Lahore",
    "premium car service Karachi",
    "airport transfer Islamabad",
    "luxury car rental Pakistan",
    "hourly driver Lahore",
    "blackdrivo Pakistan",
  ],
  alternates: {
    canonical: "/pk",
    languages: { "en-US": "/", "en-PK": "/pk" },
  },
  openGraph: {
    type: "website",
    url: "https://www.blackdrivo.com/pk",
    title: "BlackDrivo Pakistan — Premium Driver Service",
    description: "Premium driver and black car service across Lahore, Karachi, and Islamabad. Fixed pricing, professional drivers.",
    siteName: "BlackDrivo",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BlackDrivo",
  url: "https://www.blackdrivo.com/pk",
  areaServed: [
    { "@type": "City", name: "Lahore" },
    { "@type": "City", name: "Karachi" },
    { "@type": "City", name: "Islamabad" },
  ],
  description: "Premium driver and black car service across Pakistan — Lahore, Karachi, and Islamabad.",
};

export default function PakistanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePageContent region="pk" />
    </>
  );
}
