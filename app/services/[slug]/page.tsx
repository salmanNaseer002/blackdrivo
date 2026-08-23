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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ServiceDetailContent service={service} />
      <Footer />
    </div>
  );
}
