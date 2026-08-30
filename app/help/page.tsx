import type { Metadata } from "next";
import HelpContent from "@/components/help/HelpContent";

export const metadata: Metadata = {
  title: "Help Center | BlackDrivo",
  description: "Find answers to your questions about booking, payments, cancellations, and more. BlackDrivo support is available 24/7.",
  alternates: { canonical: "https://www.blackdrivo.com/help" },
};

export default function HelpPage() {
  return <HelpContent />;
}
