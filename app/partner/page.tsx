import { headers } from "next/headers";
import type { Metadata } from "next";
import PartnerLandingContent from "@/components/driver/PartnerLandingContent";

export async function generateMetadata(): Promise<Metadata> {
  const isPk = (await headers()).get("x-region") === "pk";
  if (isPk) {
    return {
      title: "Become a Driver Partner | BlackDrivo Pakistan",
      description: "Join the BlackDrivo driver network. We're hiring professional driver partners in Lahore, Karachi, and Islamabad. Premium clientele, 24/7 dispatch, competitive pay. Apply today.",
      alternates: { canonical: "https://www.blackdrivo.com/pk/partner" },
    };
  }
  return {
    title: "Become a Partner | BlackDrivo Chauffeur Network",
    description:
      "Join the BlackDrivo chauffeur network. We're hiring professional chauffeur partners in NYC, New Jersey, and Philadelphia. Premium clientele, 24/7 dispatch, competitive pay. Apply today.",
    alternates: { canonical: "https://www.blackdrivo.com/partner" },
  };
}

export default function PartnerPage() {
  return <PartnerLandingContent />;
}
