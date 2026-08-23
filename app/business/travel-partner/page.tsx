import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessSubPageContent from "@/components/business/BusinessSubPageContent";

export const metadata: Metadata = {
  title: "Travel Partner Program | BlackDrivo for Business",
  description:
    "Book ground transportation on behalf of your clients with agency-friendly rates and dedicated support.",
};

const points = [
  {
    title: "Agency-friendly rates",
    desc: "Preferred pricing on every booking made through your travel partner account.",
  },
  {
    title: "Book on behalf of clients",
    desc: "Reserve, edit, and manage rides for your clients directly, without needing their own account.",
  },
  {
    title: "White-label confirmations",
    desc: "Booking confirmations and receipts can reflect your agency's branding, not just ours.",
  },
  {
    title: "Dedicated support line",
    desc: "A direct line to our team for time-sensitive changes and last-minute requests.",
  },
  {
    title: "Consolidated agency invoicing",
    desc: "One monthly statement across every client and trip, simplifying reconciliation.",
  },
  {
    title: "Global coverage",
    desc: "Serve your clients across every market BlackDrivo operates in, from a single partner account.",
  },
  {
    title: "Airline itinerary sync",
    desc: "Ground transport that lines up with your clients' flight itineraries, including delay and gate changes.",
  },
];

export default function TravelPartnerBusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BusinessSubPageContent
        title="Built for travel agencies and managers."
        intro="Book, manage, and bill ground transportation for your clients — with the rates and support a travel partner needs."
        heroImage="/Exterior-with-door-open.jpg"
        points={points}
        ctaLabel="Become a travel partner"
      />
      <Footer />
    </div>
  );
}
