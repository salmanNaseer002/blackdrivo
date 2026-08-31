import HomePageContent from "@/components/home/HomePageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlackDrivo Pakistan — Car Rental, Airport Pickup & Drop, City to City Rides",
  description:
    "BlackDrivo is Pakistan's trusted car rental and ride service, available across Lahore, Karachi, and Islamabad. Hourly and per-day rentals, flight-tracked airport pickup and drop, city-to-city rides, and corporate travel accounts — all with fixed, upfront pricing.",
  keywords: [
    "car rental Pakistan",
    "airport pickup Lahore",
    "airport drop Karachi",
    "city to city rides Pakistan",
    "hourly car rental Lahore",
    "corporate travel Islamabad",
    "blackdrivo Pakistan",
  ],
  alternates: {
    canonical: "/pk",
    languages: { "en-US": "/", "en-PK": "/pk" },
  },
  openGraph: {
    type: "website",
    url: "https://www.blackdrivo.com/pk",
    title: "BlackDrivo Pakistan — Car Rental, Airport Pickup & Drop, City to City Rides",
    description: "Car rental, airport pickup & drop, and city-to-city rides across Lahore, Karachi, and Islamabad. Fixed pricing, verified drivers.",
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
  description: "Car rental, airport pickup & drop, and city-to-city rides across Pakistan — Lahore, Karachi, and Islamabad.",
};

export default function PakistanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePageContent region="pk" />
    </>
  );
}
