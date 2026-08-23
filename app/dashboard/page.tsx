import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AppDownloadSection from "@/components/home/AppDownloadSection";
import ServicesSection from "@/components/home/ServicesSection";
import FleetPreview from "@/components/home/FleetPreview";
import AirportSection from "@/components/home/AirportSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import OurClients from "@/components/home/OurClients";
import WhoWeAre from "@/components/home/WhoWeAre";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AppDownloadSection />
      <ServicesSection />
      <FleetPreview />
      <WhoWeAre />
      <AirportSection />
      <WhyChooseUs />
      <OurClients />
      <CTASection />
      <Footer />
    </div>
  );
}
