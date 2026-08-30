import type { Metadata } from "next";
import CareersContent from "@/components/careers/CareersContent";

export const metadata: Metadata = {
  title: "Careers | BlackDrivo",
  description: "Join the BlackDrivo team. We're hiring passionate people to help redefine premium ground transportation across the United States.",
  alternates: { canonical: "https://www.blackdrivo.com/careers" },
};

export default function CareersPage() {
  return <CareersContent />;
}
