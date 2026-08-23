import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessOverviewContent from "@/components/business/BusinessOverviewContent";

export const metadata: Metadata = {
  title: "BlackDrivo for Business | Corporate Chauffeur Solutions",
  description:
    "Corporate travel, agency bookings, and referral partnerships — one platform for every kind of business ground transportation.",
};

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BusinessOverviewContent />
      <Footer />
    </div>
  );
}
