import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BusinessSubPageContent from "@/components/business/BusinessSubPageContent";

export const metadata: Metadata = {
  title: "On-Demand Car Rental & Rides | BlackDrivo",
  description:
    "Instant, fixed-price car rental, airport pickup & drop, and city-to-city rides across Pakistan — no schedule, no account, no surge pricing.",
};

const points = [
  {
    title: "Instant booking",
    desc: "Book a car with driver the moment you need one — no advance schedule or recurring plan required.",
  },
  {
    title: "Fixed pricing, always",
    desc: "Your fare is locked in at booking. No surge pricing, no meter, no surprise at drop-off.",
  },
  {
    title: "Airport pickup & drop",
    desc: "Flight-tracked pickups that adjust automatically for delays — your driver is always waiting.",
  },
  {
    title: "City-to-city rides",
    desc: "One-way or return trips between Lahore, Karachi, and Islamabad, booked in minutes.",
  },
  {
    title: "Hourly & per-day rental",
    desc: "Keep a car and driver on hand for the hours or the day, without committing to a monthly plan.",
  },
  {
    title: "Verified drivers, 24/7",
    desc: "Every driver is licensed, insured, and background-checked — available any time, day or night.",
  },
];

export default function OnDemandPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <BusinessSubPageContent
        title="A car and driver, whenever you need one."
        intro="On-demand car rental, airport pickup & drop, and city-to-city rides across Pakistan — booked instantly, priced fairly."
        heroImage="/el-rectangle.webp"
        points={points}
        ctaLabel="Book a ride now"
        accountType="passenger"
      />
      <Footer />
    </div>
  );
}
