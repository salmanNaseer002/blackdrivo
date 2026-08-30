import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceDetailContent from "@/components/services/ServiceDetailContent";
import { services, getServiceById } from "@/lib/services/data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) return { title: "Service Not Found | BlackDrivo" };
  return {
    title: `${service.title} | BlackDrivo Premium Chauffeur`,
    description: service.tagline,
    alternates: { canonical: `https://www.blackdrivo.com/services/${slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.tagline,
    provider: { "@type": "Organization", name: "BlackDrivo", url: "https://www.blackdrivo.com" },
    areaServed: { "@type": "Country", name: "United States" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: "https://www.blackdrivo.com" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://www.blackdrivo.com/services" },
      { "@type": "ListItem", position: 3, name: service.title, item: `https://www.blackdrivo.com/services/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />
      <ServiceDetailContent service={service} />
      <Footer />
    </div>
  );
}
