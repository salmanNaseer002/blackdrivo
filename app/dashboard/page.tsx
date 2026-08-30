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
import FAQSection from "@/components/shared/FAQSection";

const faqItems = [
  { q: "What areas does BlackDrivo serve?", a: "BlackDrivo operates across New York, New Jersey, and nationwide in the United States — including airport transfers at 30+ major airports, city-to-city rides, and hourly chauffeur service." },
  { q: "How is pricing calculated?", a: "Fares are fixed at the time of booking based on your route and vehicle class — no surge pricing, no hidden fees regardless of traffic, weather, or demand." },
  { q: "Do you track my flight for airport pickups?", a: "Yes. We monitor your flight in real time and adjust your pickup automatically if it lands early, late, or at a different gate, with complimentary wait time included." },
  { q: "Can I book an hourly chauffeur for multiple stops?", a: "Yes — our hourly and per-day rental packages let you keep the same vehicle and driver for multiple stops, meetings, or events without booking separate rides." },
  { q: "What types of vehicles are available?", a: "BlackDrivo's fleet includes business-class sedans, first-class luxury sedans, and SUVs, so you can match the vehicle to your group size and occasion." },
  { q: "Is BlackDrivo available for corporate travel accounts?", a: "Yes, we offer corporate and business accounts with centralized billing, dedicated support, and reliable service for teams and executives." },
];

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
      <FAQSection items={faqItems} subtitle="Everything you need to know about booking a premium chauffeur with BlackDrivo." />
      <CTASection />
      <Footer />
    </div>
  );
}
