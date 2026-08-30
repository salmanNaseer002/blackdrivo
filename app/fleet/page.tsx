import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FleetPageContent from "@/components/fleet/FleetPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet | Luxury Black Car & Chauffeur Vehicles — BlackDrivo",
  description:
    "Explore BlackDrivo's premium fleet: executive sedans, luxury SUVs, Mercedes Sprinter limos, stretch limousines, vintage classics, and motor coaches. Book yours today.",
  keywords:
    "luxury fleet, black car service, executive sedan, Cadillac Escalade, Chevrolet Suburban, Mercedes Sprinter, stretch limousine, chauffeur vehicles NYC NJ Philadelphia",
  alternates: { canonical: "https://www.blackdrivo.com/fleet" },
};

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <FleetPageContent />
      <Footer />
    </div>
  );
}
