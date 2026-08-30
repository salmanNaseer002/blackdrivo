import ChauffeurServiceContent from "@/components/chauffeur/ChauffeurServiceContent";
import { cities } from "@/lib/data/seo-locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chauffeur Service | Premium Black Car Service Nationwide",
  description: "Professional chauffeur service in New York, New Jersey, Los Angeles, Chicago, Miami and 40+ US cities. Fixed pricing, vetted drivers, 24/7 available. Book instantly.",
  keywords: "chauffeur service, black car service, private driver, luxury car service, executive chauffeur, professional driver",
  alternates: { canonical: "https://www.blackdrivo.com/chauffeur-service" },
  openGraph: {
    title: "BlackDrivo Chauffeur Service — Nationwide Premium Ground Transportation",
    description: "Book a professional chauffeur in 40+ US cities. Fixed pricing, vetted drivers, flight tracking included.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Chauffeur Service",
  provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
  serviceType: "Chauffeur Service",
  areaServed: { "@type": "Country", name: "United States" },
  description: "Professional black car and chauffeur service in 40+ US cities. Fixed pricing, vetted drivers, 24/7 availability.",
};

export default function ChauffeurServicePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChauffeurServiceContent cities={cities} />
    </>
  );
}
