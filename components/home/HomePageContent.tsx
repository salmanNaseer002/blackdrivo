// components/home/HomePageContent.tsx
// Shared body used by both the default (US) homepage and /pk — same section
// order and layout, just region-aware copy (city names, "chauffeur" vs
// "driver") passed down to each section instead of a separately maintained
// page.
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

const faqItemsUS = [
  { q: "What areas does BlackDrivo serve?", a: "BlackDrivo operates across New York, New Jersey, and nationwide in the United States — including airport transfers at 30+ major airports, city-to-city rides, and hourly chauffeur service." },
  { q: "How is pricing calculated?", a: "Fares are fixed at the time of booking based on your route and vehicle class — no surge pricing, no hidden fees regardless of traffic, weather, or demand." },
  { q: "Do you track my flight for airport pickups?", a: "Yes. We monitor your flight in real time and adjust your pickup automatically if it lands early, late, or at a different gate, with complimentary wait time included." },
  { q: "Can I book an hourly chauffeur for multiple stops?", a: "Yes — our hourly and per-day rental packages let you keep the same vehicle and driver for multiple stops, meetings, or events without booking separate rides." },
  { q: "What types of vehicles are available?", a: "BlackDrivo's fleet includes business-class sedans, first-class luxury sedans, and SUVs, so you can match the vehicle to your group size and occasion." },
  { q: "Is BlackDrivo available for corporate travel accounts?", a: "Yes, we offer corporate and business accounts with centralized billing, dedicated support, and reliable service for teams and executives." },
];

const faqItemsPK = [
  { q: "Which cities in Pakistan does BlackDrivo serve?", a: "BlackDrivo currently operates in Lahore, Karachi, and Islamabad, with plans to expand to more cities across Pakistan." },
  { q: "How is pricing calculated?", a: "Fares are fixed at the time of booking based on your route and vehicle class — no surge pricing, no hidden fees regardless of traffic or demand." },
  { q: "Does BlackDrivo offer airport transfers in Pakistan?", a: "Yes, BlackDrivo provides airport transfer service in Lahore, Karachi, and Islamabad with professional drivers and reliable pickup times." },
  { q: "Can I book an hourly driver for multiple stops?", a: "Yes — our hourly and per-day rental packages let you keep the same vehicle and driver for multiple stops, meetings, or events without booking separate rides." },
  { q: "What types of vehicles are available?", a: "BlackDrivo's fleet includes business-class sedans, first-class luxury sedans, and SUVs, so you can match the vehicle to your group size and occasion." },
  { q: "Is BlackDrivo available for corporate travel accounts?", a: "Yes, we offer corporate and business accounts with centralized billing, dedicated support, and reliable service for teams and executives." },
];

export default function HomePageContent({ region = "us" }: { region?: "us" | "pk" }) {
  const faqItems = region === "pk" ? faqItemsPK : faqItemsUS;
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection region={region} />
      <AppDownloadSection />
      <ServicesSection region={region} />
      <FleetPreview region={region} />
      <WhoWeAre region={region} />
      <AirportSection region={region} />
      <WhyChooseUs />
      <OurClients region={region} />
      <FAQSection
        items={faqItems}
        subtitle={`Everything you need to know about booking a premium ${region === "pk" ? "driver" : "chauffeur"} with BlackDrivo.`}
      />
      <CTASection region={region} />
      <Footer />
    </div>
  );
}
