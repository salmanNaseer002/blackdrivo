export interface ServiceEntry {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
}

export const services: ServiceEntry[] = [
  {
    id: "airport",
    title: "Airport Transfer",
    tagline: "Smooth landings, every time.",
    description:
      "At BlackDrivo, the client always comes first. Our focus on customer service and client satisfaction guarantees a professional, pleasurable ride. Whether traveling for business or leisure, our chauffeurs provide the ultimate relaxing experience in the safety and comfort of our top-of-the-line vehicles.",
    features: [
      "Live FAA flight tracking & automatic adjustment",
      "60 minutes complimentary wait time (domestic)",
      "90 minutes complimentary wait time (international)",
      "Meet & greet or curbside options",
      "Tarmac-side & FBO coordination available",
      "Available at JFK, LGA, EWR, HPN, ISP & more",
    ],
    image: "/el-thumb-2.webp",
  },
  {
    id: "corporate",
    title: "Corporate Travel",
    tagline: "Business travel, simplified.",
    description:
      "Streamline ground transportation for your entire organization. Our late-model fleet is equipped with advanced GPS tracking and real-time communication systems monitored by our 24/7 dispatch center. We provide a secure, controlled environment for high-profile travelers and sensitive corporate discussions.",
    features: [
      "Centralized billing & consolidated invoicing",
      "Department-level tracking & expense management",
      "Dedicated account manager",
      "Chauffeurs trained in strict non-disclosure protocols",
      "Priority booking & 24/7 concierge desk",
      "Monthly reporting & analytics portal",
    ],
    image: "/el-thumb-1.webp",
  },
  {
    id: "hourly",
    title: "Hourly Chauffeur",
    tagline: "Your driver, your schedule.",
    description:
      "Our \"As-Directed\" service provides a dedicated chauffeur and late-model vehicle for any duration. This option allows for total itinerary flexibility and immediate adjustments as your schedule evolves — perfect for full days in the city, multiple meetings, or whenever you need a driver on standby.",
    features: [
      "Book from 2 to 24 hours",
      "Multiple stops included",
      "Driver stays on standby throughout",
      "Flexible scheduling changes at any time",
      "Perfect for NYC & NJ business days",
      "Available for events and personal errands",
    ],
    image: "/el-hero-bg.webp",
  },
  {
    id: "city",
    title: "City-to-City Rides",
    tagline: "Between cities, done better.",
    description:
      "Turn long-distance drives into productive, comfortable journeys. All predictable expenses are integrated into our transparent pricing model prior to dispatch — eliminating administrative surprises and ensuring a seamless billing experience. NY to DC, NYC to Boston, NJ to Philadelphia and beyond.",
    features: [
      "Fixed flat-rate transparent pricing",
      "NYC to DC, Boston, Philadelphia & more",
      "High-speed Wi-Fi enabled vehicles",
      "Chilled mineral water & charging interfaces",
      "Professional chauffeur throughout",
      "Door-to-door service",
    ],
    image: "/suv-2.jpg",
  },
  {
    id: "weddings",
    title: "Weddings",
    tagline: "Your perfect day, perfectly arrived.",
    description:
      "Make your wedding day unforgettable with BlackDrivo. Our luxury fleet and professional uniformed chauffeurs ensure you and your wedding party arrive in elegance and comfort. We coordinate every detail — from the ceremony to the reception — so you can focus entirely on your special day.",
    features: [
      "Bridal party coordination & multi-vehicle management",
      "Stretch limousines, luxury sedans & SUVs available",
      "Uniformed, professional chauffeurs",
      "Complimentary decorations upon request",
      "Flexible timeline to match your schedule",
      "Available across NY, NJ & Philadelphia",
    ],
    image: "/el-thumb-4.webp",
  },
  {
    id: "events",
    title: "Special Events",
    tagline: "Arrive the way you deserve.",
    description:
      "Make every special occasion unforgettable with a luxury chauffeur. Galas, fundraisers, Broadway shows, corporate functions — we coordinate every detail. Our fleet includes luxury sedans, premium SUVs, executive vans, and Sprinter vans to accommodate individuals and groups of all sizes.",
    features: [
      "Corporate event transportation",
      "Galas, fundraisers & black-tie events",
      "Broadway shows & sporting events",
      "Group coordination for multiple vehicles",
      "Professional uniformed chauffeurs",
      "Available 24/7, 365 days a year",
    ],
    image: "/Exterior-with-door-open.jpg",
  },
];

export function getServiceById(id: string): ServiceEntry | undefined {
  return services.find((s) => s.id === id);
}
