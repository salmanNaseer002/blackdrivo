import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Us | BlackDrivo",
  description:
    "Get in touch with BlackDrivo — passenger support, partner support, travel agency, and business partnership teams.",
  alternates: { canonical: "https://www.blackdrivo.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ContactPageContent />
      <Footer />
    </div>
  );
}
