import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessSubPageContent from "@/components/business/BusinessSubPageContent";

export const metadata: Metadata = {
  title: "Travel Agent Program | BlackDrivo for Business",
  description:
    "Discounted, agent-only rates on car rentals, airport pickup & drop, and city-to-city rides across Pakistan — book on behalf of your clients with one consolidated monthly invoice.",
};

const points = [
  {
    title: "Agent-only rates",
    desc: "Preferred, discounted pricing on every ride booked through your travel agent account — passed on as margin or savings for your clients.",
  },
  {
    title: "Book on behalf of clients",
    desc: "Reserve, edit, and manage rides for your clients directly, without needing them to have their own account.",
  },
  {
    title: "Fixed, route-wise pricing",
    desc: "Every route — city-to-city, airport pickup & drop, or hourly — is fixed at booking, so you can quote clients confidently in advance.",
  },
  {
    title: "Dedicated account manager",
    desc: "A single point of contact for onboarding, rate questions, and time-sensitive changes.",
  },
  {
    title: "Consolidated monthly invoicing",
    desc: "One statement across every client and trip each month, so reconciliation stays simple.",
  },
  {
    title: "Coverage across Pakistan",
    desc: "Serve your clients in Lahore, Karachi, and Islamabad from a single travel agent account.",
  },
  {
    title: "Flight-tracked airport service",
    desc: "Client pickups adjust automatically for flight delays — no manual coordination needed from you.",
  },
];

export default function TravelAgentBusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BusinessSubPageContent
        title="Built for travel agents in Pakistan."
        intro="Book, manage, and bill car rentals, airport transfers, and city-to-city rides for your clients — with agent-only rates and one monthly invoice."
        heroImage="/Exterior-with-door-open.jpg"
        points={points}
        ctaLabel="Become a travel agent"
        accountType="agency"
      />
      <Footer />
    </div>
  );
}
