import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesPageContent from "@/components/services/ServicesPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | BlackDrivo Premium Chauffeur",
  description:
    "Premium black car services: airport & seaport transfers, corporate travel, hourly chauffeur, city-to-city rides, weddings, special events, and night-on-the-town — across New York, New Jersey, and Philadelphia.",
  alternates: { canonical: "https://www.blackdrivo.com/services" },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ServicesPageContent />
      <Footer />
    </div>
  );
}
