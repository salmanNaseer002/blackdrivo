import { headers } from "next/headers";
import type { Metadata } from "next";
import PressContent from "@/components/press/PressContent";

export async function generateMetadata(): Promise<Metadata> {
  const isPk = (await headers()).get("x-region") === "pk";
  if (isPk) {
    return {
      title: "Press & Media | BlackDrivo Pakistan",
      description: "Press resources, media coverage, and contact information for BlackDrivo — car rental and driver service across Pakistan.",
      alternates: { canonical: "https://www.blackdrivo.com/pk/press" },
    };
  }
  return {
    title: "Press & Media | BlackDrivo",
    description: "Press resources, media coverage, and contact information for BlackDrivo — premium black car service across the tri-state area.",
    alternates: { canonical: "https://www.blackdrivo.com/press" },
  };
}

export default function PressPage() {
  return <PressContent />;
}
