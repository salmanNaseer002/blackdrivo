import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessSubPageContent from "@/components/business/BusinessSubPageContent";

export const metadata: Metadata = {
  title: "Corporate Travel | BlackDrivo for Business",
  description:
    "Centralized billing, travel policy controls, and priority support for your company's ground transportation.",
};

const points = [
  {
    title: "Centralized billing",
    desc: "One consolidated monthly invoice with detailed, exportable reporting for every trip your team takes.",
  },
  {
    title: "Travel policy controls",
    desc: "Set vehicle class limits, approved routes, and spending rules — automatically enforced at booking.",
  },
  {
    title: "Traveler profiles",
    desc: "Saved preferences, frequent addresses, and loyalty details for every employee on your account.",
  },
  {
    title: "Priority dispatch",
    desc: "Corporate accounts get priority vehicle assignment, especially during high-demand periods.",
  },
  {
    title: "Dedicated account manager",
    desc: "A single point of contact for onboarding, billing questions, and special requests.",
  },
  {
    title: "Real-time trip tracking",
    desc: "Your travel coordinator can follow every active ride, live, from a single dashboard.",
  },
  {
    title: "Airline & crew coordination",
    desc: "Flight-tracked pickups, delay rebooking, and crew transport handled without you having to call ahead.",
  },
];

export default function CorporateBusinessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BusinessSubPageContent
        title="Corporate travel, simplified."
        intro="Give your company one reliable partner for every ground transportation need — with the billing and policy controls your finance team expects."
        heroImage="/Exterior-from-rear-door-open.jpg"
        points={points}
        ctaLabel="Set up a corporate account"
      />
      <Footer />
    </div>
  );
}
