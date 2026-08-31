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
    title: "Dedicated account manager",
    desc: "A single point of contact assigned to your company for onboarding, route setup, billing questions, and special requests.",
  },
  {
    title: "Route-wise fixed billing",
    desc: "Every recurring route your company runs is priced and fixed in advance — no per-trip negotiation, no surprises on the invoice.",
  },
  {
    title: "Monthly consolidated invoicing",
    desc: "One invoice at the end of each billing period covering every trip, every employee, every route — reviewed and finalized with you before it's issued.",
  },
  {
    title: "Scheduled, recurring pick-drop",
    desc: "Set a fixed pickup time and days of the week once — office commutes, airport runs, or any repeating route — and it runs automatically from then on.",
  },
  {
    title: "Traveler & passenger profiles",
    desc: "Every employee riding on your account has their own profile, so pickup addresses and preferences don't need to be re-entered each time.",
  },
  {
    title: "Real-time trip tracking",
    desc: "Your travel coordinator can follow every active ride, live, from a single dashboard.",
  },
  {
    title: "Airline & flight coordination",
    desc: "Flight-tracked pickups and automatic delay adjustment for traveling employees and visiting clients.",
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
        accountType="business"
      />
      <Footer />
    </div>
  );
}
