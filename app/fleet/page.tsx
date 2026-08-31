import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FleetPageContent, { type FleetVehicle } from "@/components/fleet/FleetPageContent";
import { createPublicClient } from "@/lib/supabase/publicClient";
import type { Metadata } from "next";

// Admin-managed content (fleet_catalog_vehicles) — revalidate periodically
// instead of only at build time, so a vehicle added/edited in Admin shows up
// on the live site without needing a full redeploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Fleet | Luxury Black Car & Chauffeur Vehicles — BlackDrivo",
  description:
    "Explore BlackDrivo's premium fleet: executive sedans, luxury SUVs, Mercedes Sprinter limos, stretch limousines, vintage classics, and motor coaches. Book yours today.",
  keywords:
    "luxury fleet, black car service, executive sedan, Cadillac Escalade, Chevrolet Suburban, Mercedes Sprinter, stretch limousine, chauffeur vehicles NYC NJ Philadelphia",
  alternates: { canonical: "https://www.blackdrivo.com/fleet" },
};

// Server-fetched once per request from Admin-managed fleet_catalog_vehicles —
// both countries' rows are fetched here (small dataset) and the client
// component filters by region, same "fetch all, filter client-side" idiom
// already used for the cities/airports arrays elsewhere on this site.
async function getFleetVehicles(): Promise<FleetVehicle[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("fleet_catalog_vehicles")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Failed to load fleet_catalog_vehicles:", error.message);
    return [];
  }
  return (data as FleetVehicle[]) || [];
}

export default async function FleetPage() {
  const vehicles = await getFleetVehicles();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <FleetPageContent vehicles={vehicles} />
      <Footer />
    </div>
  );
}
