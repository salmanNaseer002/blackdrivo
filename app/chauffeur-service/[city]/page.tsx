import { notFound } from "next/navigation";
import { cities } from "@/lib/data/seo-locations";
import CityPageContent from "@/components/chauffeur/CityPageContent";
import type { Metadata } from "next";

interface Props { params: Promise<{ city: string }> }

export function generateStaticParams() {
  return cities.map(c => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = cities.find(c => c.slug === citySlug);
  if (!city) return { title: "Not Found" };
  const isPk = city.country === "Pakistan";
  // This route is statically generated (generateStaticParams) — the same
  // pre-built HTML is served for both /chauffeur-service/<city> and (via
  // middleware.ts's rewrite) /pk/chauffeur-service/<city>, since a static
  // page can't vary per-request. Metadata/JSON-LD here branch on the city's
  // own `country` field (not the request path) so a genuinely Pakistani
  // city (Lahore/Karachi/Islamabad) always gets correct, non-US-worded
  // metadata regardless of which URL prefix served it.
  if (isPk) {
    return {
      title: `Car Rental & Driver Service ${city.name} | Airport Pickup & Drop ${city.name}`,
      description: `Car rental and driver service in ${city.name}, Pakistan. Fixed pricing, verified drivers, 24/7 availability. Book a car with driver in ${city.name} instantly — serving ${city.airport}.`,
      keywords: `car rental ${city.name}, driver service ${city.name}, airport pickup ${city.name}, airport drop ${city.name}, city to city rides Pakistan, hourly car rental ${city.name}`,
      alternates: { canonical: `https://www.blackdrivo.com/chauffeur-service/${city.slug}` },
      openGraph: {
        title: `BlackDrivo Car Rental & Driver Service ${city.name}`,
        description: `Book a car with driver in ${city.name}. Fixed pricing, verified drivers, 24/7 available. Serving ${city.airport}.`,
        type: "website",
      },
    };
  }
  return {
    title: `Chauffeur Service ${city.name} | Black Car Service ${city.name}, ${city.state}`,
    description: `Premium chauffeur service in ${city.name}, ${city.state}. Fixed pricing, professional drivers, 24/7 availability. Book a black car in ${city.name} instantly — serving ${city.airport}.`,
    keywords: `chauffeur service ${city.name}, black car service ${city.name}, private driver ${city.name}, luxury car service ${city.state}, airport transfer ${city.airport}`,
    alternates: { canonical: `https://www.blackdrivo.com/chauffeur-service/${city.slug}` },
    openGraph: {
      title: `BlackDrivo Chauffeur Service ${city.name}, ${city.state}`,
      description: `Book a professional chauffeur in ${city.name}. Fixed pricing, vetted drivers, 24/7 available. Serving ${city.airport}.`,
      type: "website",
    },
  };
}

const getFaqsUs = (city: { name: string; state: string; airport: string }) => [
  { q: `How do I book a chauffeur in ${city.name}?`,             a: `Use the BlackDrivo booking form, enter your pickup address in ${city.name}, choose your vehicle class, and confirm. You receive instant confirmation with your driver's details.` },
  { q: `What airports does BlackDrivo serve in ${city.name}?`,  a: `BlackDrivo serves ${city.airport} and all major airports accessible from ${city.name}, ${city.state}. Live flight tracking is included with every airport transfer.` },
  { q: `Is pricing fixed for rides in ${city.name}?`,           a: `Yes. All BlackDrivo fares in ${city.name} are fixed at booking. No surge pricing, no metered fares — what you see is what you pay.` },
  { q: `Are chauffeurs in ${city.name} professionally vetted?`, a: `Every BlackDrivo driver in ${city.name} passes a comprehensive background check, DMV records review, and in-person skills evaluation before their first trip.` },
  { q: `What vehicles are available in ${city.name}?`,          a: `BlackDrivo offers Executive Sedan, First Class Sedan, Luxury SUV, Executive SUV, and Sprinter Van in ${city.name}. Availability confirmed at booking.` },
];

const getFaqsPk = (city: { name: string; state: string; airport: string }) => [
  { q: `How do I book a driver in ${city.name}?`,              a: `Use the BlackDrivo booking form, enter your pickup address in ${city.name}, choose your vehicle class, and confirm. You receive instant confirmation with your driver's details.` },
  { q: `What airports does BlackDrivo serve in ${city.name}?`,  a: `BlackDrivo serves ${city.airport} and all major airports accessible from ${city.name}. Live flight tracking is included with every airport transfer.` },
  { q: `Is pricing fixed for rides in ${city.name}?`,           a: `Yes. All BlackDrivo fares in ${city.name} are fixed at booking. No surge pricing, no metered fares — what you see is what you pay.` },
  { q: `Are drivers in ${city.name} professionally vetted?`,    a: `Every BlackDrivo driver in ${city.name} passes a comprehensive background check, records review, and in-person skills evaluation before their first trip.` },
  { q: `What vehicles are available in ${city.name}?`,          a: `BlackDrivo offers Executive Sedan, First Class Sedan, Luxury SUV, Executive SUV, and Sprinter Van in ${city.name}. Availability confirmed at booking.` },
];

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = cities.find(c => c.slug === citySlug);
  if (!city) notFound();

  const isPk = city.country === "Pakistan";
  const faqsUs = getFaqsUs(city);
  const faqsPk = getFaqsPk(city);

  const serviceJsonLd = isPk
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Car Rental & Driver Service ${city.name}`,
        description: `Car rental, airport pickup & drop, and city-to-city rides in ${city.name}, Pakistan. Available 24/7 with fixed, upfront pricing.`,
        provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
        areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: "Pakistan" } },
        serviceType: "Car Rental & Driver Service",
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Chauffeur Service ${city.name}`,
        description: `Premium black car and chauffeur service in ${city.name}, ${city.state}. Available 24/7 for airport transfers, executive transportation, and corporate travel.`,
        provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
        areaServed: { "@type": "City", name: city.name, containedInPlace: { "@type": "State", name: city.state } },
        serviceType: "Chauffeur Service",
      };

  // Now correctly matches the city's own market (city.country), not the
  // request path — see the note in generateMetadata.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (isPk ? faqsPk : faqsUs).map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",              item: "https://www.blackdrivo.com" },
      { "@type": "ListItem", position: 2, name: "Chauffeur Service", item: "https://www.blackdrivo.com/chauffeur-service" },
      { "@type": "ListItem", position: 3, name: city.name,           item: `https://www.blackdrivo.com/chauffeur-service/${city.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <CityPageContent city={city} faqsUs={faqsUs} faqsPk={faqsPk} />
    </>
  );
}
