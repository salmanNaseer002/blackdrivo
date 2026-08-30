import type { Metadata } from "next";
import PressContent from "@/components/press/PressContent";

export const metadata: Metadata = {
  title: "Press & Media | BlackDrivo",
  description: "Press resources, media coverage, and contact information for BlackDrivo — premium black car service across the tri-state area.",
  alternates: { canonical: "https://www.blackdrivo.com/press" },
};

export default function PressPage() {
  return <PressContent />;
}
