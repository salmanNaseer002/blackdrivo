import { headers } from "next/headers";
import ChauffeurServiceContent from "@/components/chauffeur/ChauffeurServiceContent";
import { cities } from "@/lib/data/seo-locations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const isPk = (await headers()).get("x-region") === "pk";
  if (isPk) {
    return {
      title: "Driver Service | Car Rental & Driver Service Pakistan",
      description: "Professional driver service in Lahore, Karachi, and Islamabad. Fixed pricing, verified drivers, 24/7 available. Book instantly.",
      keywords: "driver service Pakistan, car rental Pakistan, private driver Lahore, driver service Karachi, driver service Islamabad",
      alternates: { canonical: "https://www.blackdrivo.com/pk/chauffeur-service" },
      openGraph: {
        title: "BlackDrivo Driver Service — Pakistan",
        description: "Book a verified driver in Lahore, Karachi, or Islamabad. Fixed pricing, flight tracking included.",
        type: "website",
      },
    };
  }
  return {
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
}

export default async function ChauffeurServicePage() {
  const isPk = (await headers()).get("x-region") === "pk";
  const jsonLd = isPk
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Driver Service",
        provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
        serviceType: "Driver Service",
        areaServed: { "@type": "Country", name: "Pakistan" },
        description: "Professional driver service in Lahore, Karachi, and Islamabad. Fixed pricing, verified drivers, 24/7 availability.",
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Chauffeur Service",
        provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
        serviceType: "Chauffeur Service",
        areaServed: { "@type": "Country", name: "United States" },
        description: "Professional black car and chauffeur service in 40+ US cities. Fixed pricing, vetted drivers, 24/7 availability.",
      };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChauffeurServiceContent cities={cities} />
    </>
  );
}
