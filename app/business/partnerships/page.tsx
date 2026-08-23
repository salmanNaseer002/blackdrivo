import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessSubPageContent from "@/components/business/BusinessSubPageContent";

export const metadata: Metadata = {
  title: "Business Partnerships | BlackDrivo for Business",
  description:
    "Referral and concierge partnerships for hotels, venues, and event planners.",
};

const points = [
  {
    title: "Hotel concierge partnerships",
    desc: "Offer your guests reliable, on-brand ground transportation, arranged directly through your concierge desk.",
  },
  {
    title: "Venue & event partnerships",
    desc: "Coordinated transportation for weddings, conferences, and large events, from planning through execution.",
  },
  {
    title: "Referral program",
    desc: "Earn referral credit for every client you send our way — simple, transparent, and paid out monthly.",
  },
  {
    title: "Co-branded booking links",
    desc: "A dedicated booking link for your property or business, pre-filled with your partnership details.",
  },
  {
    title: "Priority scheduling",
    desc: "Partner bookings receive priority vehicle assignment during peak periods and events.",
  },
  {
    title: "Single point of contact",
    desc: "One partnerships manager who understands your business and handles every request personally.",
  },
  {
    title: "Airline & travel-brand tie-ups",
    desc: "Ground transport partnerships for airlines and travel brands looking to extend the journey beyond the terminal.",
  },
];

export default function BusinessPartnershipsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BusinessSubPageContent
        title="Partner with BlackDrivo."
        intro="For hotels, venues, and event planners looking to offer their guests a trusted, on-brand ground transportation experience."
        heroImage="/suv-2.jpg"
        points={points}
        ctaLabel="Explore a partnership"
        accountType="business"
      />
      <Footer />
    </div>
  );
}
