import type { Metadata } from "next";
import PartnerLandingContent from "@/components/driver/PartnerLandingContent";

export const metadata: Metadata = {
  title: "Become a Partner | BlackDrivo Chauffeur Network",
  description:
    "Join the BlackDrivo chauffeur network. We're hiring professional chauffeur partners in NYC, New Jersey, and Philadelphia. Premium clientele, 24/7 dispatch, competitive pay. Apply today.",
};

export default function PartnerPage() {
  return <PartnerLandingContent />;
}
