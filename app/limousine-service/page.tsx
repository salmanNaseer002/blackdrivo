import type { Metadata } from "next";
import LimousineServiceContent from "@/components/limousine/LimousineServiceContent";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Luxury Limousine Service | Premium Limo Rental — BlackDrivo",
  description:
    "Premium limousine service for airport transfers, weddings, corporate events & VIP transportation. Stretch limos, Mercedes Sprinters & Escalades. Fixed pricing, professional chauffeurs, 24/7 availability. Book instantly.",
  keywords:
    "limousine service, luxury limousine, stretch limousine, limo rental, airport limousine, wedding limousine, corporate limousine, chauffeur service, VIP transportation, black car service, executive limo",
  alternates: { canonical: "https://www.blackdrivo.com/limousine-service" },
  openGraph: {
    title: "BlackDrivo Luxury Limousine Service — Premium Limo Worldwide",
    description:
      "Travel in ultimate comfort with BlackDrivo's premium limousine fleet. Airport transfers, weddings, corporate events & VIP transportation. Fixed pricing, professional chauffeurs, 24/7.",
    type: "website",
    url: "https://www.blackdrivo.com/limousine-service",
    images: [
      {
        url: "/STRETCH LIMOUSINE.jpg",
        width: 1200,
        height: 630,
        alt: "BlackDrivo Stretch Limousine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackDrivo Luxury Limousine Service",
    description:
      "Premium limousine service for airports, weddings, corporate events & VIP transportation.",
    images: ["/STRETCH LIMOUSINE.jpg"],
  },
};

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BlackDrivo",
  url: "https://www.blackdrivo.com",
  logo: "https://www.blackdrivo.com/logo%20wb.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-555-0199",
    contactType: "customer service",
    availableLanguage: "English",
    contactOption: "TollFree",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Luxury Limousine Service",
  provider: {
    "@type": "Organization",
    name: "BlackDrivo",
    url: "https://www.blackdrivo.com",
  },
  serviceType: "Limousine Service",
  areaServed: { "@type": "Country", name: "United States" },
  description:
    "Premium luxury limousine service for airport transfers, weddings, corporate events, and VIP transportation. Professional chauffeurs, fixed pricing, 24/7 availability.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.blackdrivo.com" },
    { "@type": "ListItem", position: 2, name: "Limousine Service", item: "https://www.blackdrivo.com/limousine-service" },
  ],
};

const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "BlackDrivo Limousine Service",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "847",
    bestRating: "5",
  },
};

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const faqItems = [
  {
    q: "How much does a limousine service cost?",
    a: "BlackDrivo limousine pricing varies by vehicle type, distance, and duration. Stretch limousines start from $150/hour, with airport transfers from $250. All pricing is fixed and fully transparent — no hidden fees or surge charges. Request an instant quote online for your specific route and date.",
  },
  {
    q: "Can I book a limousine for airport transfers?",
    a: "Yes, absolutely. Airport limousine service is one of our most requested offerings. We provide real-time flight tracking, professional meet & greet service inside arrivals, and complimentary wait time (60 minutes domestic, 90 minutes international). We serve 30+ major US airports.",
  },
  {
    q: "Do you offer wedding limousines?",
    a: "BlackDrivo specializes in wedding limousine service. We offer stretch limousines, luxury Sprinters, and executive SUVs that can be tastefully decorated for your special day. Our chauffeurs are trained in wedding etiquette and ensure a seamless, punctual, and unforgettable experience.",
  },
  {
    q: "Are your chauffeurs professionally trained?",
    a: "All BlackDrivo chauffeurs undergo rigorous background checks, defensive driving training, customer service certification, and quarterly performance reviews. They are uniformed professionals with extensive local knowledge and an unwavering commitment to punctuality and discretion.",
  },
  {
    q: "Do you provide limousine service nationwide?",
    a: "Yes. BlackDrivo operates in 40+ US cities including New York, New Jersey, Los Angeles, Chicago, Miami, Dallas, Las Vegas, Boston, Washington DC, and more. We also offer point-to-point service between cities for long-distance luxury travel.",
  },
  {
    q: "How far in advance should I book a limousine?",
    a: "For standard bookings, we recommend 24–48 hours in advance. For weddings and milestone events, booking 2–4 weeks ahead guarantees your preferred vehicle. For peak dates such as New Year's Eve, prom season, or major sporting events, book 6–8 weeks in advance.",
  },
  {
    q: "What is included in the limousine rental price?",
    a: "Your BlackDrivo limousine rental includes a professional uniformed chauffeur, complimentary bottled water, high-speed WiFi, premium audio, and all fuel costs. Airport pickups include flight tracking and complimentary wait time. There are no hidden fees — your quoted price is your final price.",
  },
  {
    q: "Can I bring alcohol in the limousine?",
    a: "Passengers of legal drinking age (21+) are welcome to bring their own beverages. Most of our premium vehicles feature a built-in mini bar setup with glassware. Please ensure compliance with local open container laws in your area.",
  },
  {
    q: "Is gratuity included in the pricing?",
    a: "A standard 20% gratuity is included in most bookings for your convenience. You may request an adjustment based on your experience. Additional gratuity can always be provided directly to your chauffeur for exceptional service.",
  },
  {
    q: "What happens if my flight is delayed?",
    a: "BlackDrivo monitors all flights in real time using professional flight tracking systems. If your flight is delayed, your chauffeur automatically adjusts the pickup schedule at no additional charge. You are never penalized for flight delays outside your control.",
  },
  {
    q: "Do you offer corporate limousine accounts?",
    a: "Yes. We offer dedicated corporate accounts with monthly billing, priority booking, designated account managers, and detailed expense reporting. Corporate rate discounts are available for regular clients. Contact our corporate team at corporate@blackdrivo.com for details.",
  },
  {
    q: "Can I hire a limousine for a full day?",
    a: "Absolutely. Full-day limousine hire is available and provides excellent value for road shows, multi-stop corporate itineraries, or extended event transportation. We offer hourly packages from 2 hours to 12+ hours with full-day flat rates for sustained engagements.",
  },
  {
    q: "What are your most popular limousine routes?",
    a: "Our most popular routes include JFK–Manhattan, EWR–Manhattan, LAX–Beverly Hills, O'Hare–Downtown Chicago, and MIA–Miami Beach. We serve all suburban and inter-city routes. Contact us for custom routing and competitive pricing on any itinerary.",
  },
  {
    q: "Is the pricing fixed or can it change after booking?",
    a: "All BlackDrivo pricing is 100% fixed at the time of booking. Your quoted fare is fully guaranteed regardless of traffic, weather conditions, or market demand fluctuations. We never use surge pricing — not on holidays, not during peak hours, ever.",
  },
  {
    q: "Do you provide child safety seats?",
    a: "Yes. Child safety seats are available upon request at no extra charge. Please specify your child's age and weight when booking so we can provide the appropriate seat — infant carrier, convertible seat, or booster seat.",
  },
  {
    q: "Can I decorate the limousine for a special event?",
    a: "We welcome tasteful decorations for weddings, anniversaries, birthdays, proms, and other special events. Please discuss your decoration plans with us at the time of booking. Any damage caused to the vehicle interior remains the renter's responsibility.",
  },
  {
    q: "What vehicles are in your limousine fleet?",
    a: "Our limousine fleet includes Stretch Limousines (up to 10 passengers), Mercedes Luxury Sprinter Limos (up to 14 passengers), Cadillac Escalade Limousines (up to 6 in VIP configuration), and Executive Sprinter Vans (up to 12 passengers in conference layout).",
  },
  {
    q: "How many passengers can a stretch limousine hold?",
    a: "Our standard stretch limousines comfortably accommodate up to 10 passengers. For larger groups, our Mercedes Sprinter Limo seats 14, and we can coordinate multi-vehicle convoys for groups of any size. Contact us to discuss your specific group requirements.",
  },
  {
    q: "Do you service prom and graduation events?",
    a: "Prom limousine service is a specialty at BlackDrivo. We offer stretch limos, Sprinter party packages, and decorated vehicles for prom night. All vehicles are thoroughly inspected before prom pickups, and our chauffeurs are specifically briefed for these special occasions.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made 24+ hours before the scheduled pickup receive a full refund. Cancellations within 24 hours are charged 50% of the fare. No-shows are charged the full fare. For special events such as weddings and proms, specific cancellation terms apply — please review at time of booking.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(item => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

// ─── Page Data ────────────────────────────────────────────────────────────────

const vehicles = [
  {
    name: "Stretch Limousine",
    tagline: "CLASSIC LUXURY",
    image: "/STRETCH LIMOUSINE.jpg",
    passengers: "Up to 10 Passengers",
    bags: "7 Suitcases",
    features: [
      "Privacy Divider",
      "Luxury Leather Seating",
      "Premium Sound System",
      "LED Mood Lighting",
      "Full Wet Bar",
      "USB Charging",
      "High-Speed WiFi",
      "Dual Climate Control",
    ],
  },
  {
    name: "Mercedes Luxury Sprinter",
    tagline: "FIRST CLASS",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=85",
    passengers: "Up to 14 Passengers",
    bags: "14 Suitcases",
    features: [
      "Executive Captain Seats",
      "Twin 4K Smart TVs",
      "High-Speed WiFi",
      "Privacy Shades",
      "Champagne Refrigerator",
      "Luxury LED Lighting",
      "Business Meeting Layout",
      "Amazon Fire Streaming",
    ],
  },
  {
    name: "Cadillac Escalade Limo",
    tagline: "VIP PRESENCE",
    image: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?auto=format&fit=crop&w=800&q=85",
    passengers: "Up to 6 Passengers",
    bags: "6 Suitcases",
    features: [
      "VIP Premium Interior",
      "Heated & Cooled Leather",
      "Harman Kardon Audio",
      "LED Fiber Optic Ceiling",
      "Bar Area with Ice",
      "Bluetooth Audio",
      "Tinted Privacy Windows",
      "USB & Wireless Charging",
    ],
  },
  {
    name: "Executive Sprinter Van",
    tagline: "CORPORATE ELITE",
    image: "/suv-2.jpg",
    passengers: "Up to 12 Passengers",
    bags: "12 Suitcases",
    features: [
      "Conference Seating Layout",
      "Fold-Out Work Tables",
      "110V Charging Outlets",
      "High-Speed WiFi",
      "Privacy Tinted Glass",
      "Premium Sound System",
      "Individual Reading Lights",
      "Executive Headrests",
    ],
  },
];

const galleryImages = [
  { src: "/STRETCH LIMOUSINE.jpg", alt: "BlackDrivo Stretch Limousine exterior", tall: true },
  { src: "/limo-1.jpg", alt: "Limousine luxury interior", tall: false },
  { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80", alt: "Luxury vehicle interior ambience", tall: false },
  { src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80", alt: "Mercedes Sprinter limousine exterior", tall: false },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80", alt: "VIP vehicle interior seating", tall: true },
  { src: "/suv-2.jpg", alt: "Luxury executive SUV exterior", tall: false },
  { src: "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?auto=format&fit=crop&w=600&q=80", alt: "Professional chauffeur service", tall: false },
  { src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80", alt: "Airport limousine pickup", tall: false },
  { src: "/vintage-main.jpg", alt: "Executive sedan luxury transport", tall: false },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Bride · Manhattan Wedding",
    rating: 5,
    text: "BlackDrivo transformed our wedding day. The stretch limousine was absolutely immaculate, the chauffeur was incredibly professional, and everything ran perfectly on schedule. Every single guest was genuinely impressed.",
    initials: "SM",
  },
  {
    name: "James Thornton",
    role: "VP · Goldman Sachs",
    rating: 5,
    text: "I've used BlackDrivo for all my executive travel for three years. The consistency is remarkable — always on time, always professional, always the right vehicle. Our corporate account team is truly exceptional.",
    initials: "JT",
  },
  {
    name: "Michael Rodriguez",
    role: "Frequent Business Traveler",
    rating: 5,
    text: "The flight tracking feature is a genuine game-changer. My flight was delayed two hours and my chauffeur adjusted perfectly. No stress, no extra charges. This is exactly how airport transfers should work.",
    initials: "MR",
  },
  {
    name: "Jennifer Lawson",
    role: "Prom Night · NJ",
    rating: 5,
    text: "I booked a stretch limo for my daughter's prom. The chauffeur was so professional and the vehicle was simply stunning. She and her friends had the most memorable night. BlackDrivo made it truly magical.",
    initials: "JL",
  },
  {
    name: "David Kim",
    role: "Entertainment Executive · LA",
    rating: 5,
    text: "Discretion and reliability are everything in my world. BlackDrivo delivers both flawlessly, every single time. The VIP service is genuinely five-star — I recommend them without hesitation to all my clients.",
    initials: "DK",
  },
  {
    name: "Amanda Sterling",
    role: "Anniversary Celebration · NYC",
    rating: 5,
    text: "My husband surprised me with a BlackDrivo limousine for our 25th anniversary. The champagne, the music, the route through Manhattan — everything was absolutely perfect. An evening I will never forget.",
    initials: "AS",
  },
];

const steps = [
  {
    num: "01",
    title: "Choose Your Vehicle",
    desc: "Browse our premium fleet and select the vehicle that perfectly fits your occasion, group size, and style.",
  },
  {
    num: "02",
    title: "Request Your Quote",
    desc: "Get an instant fixed-price quote online or speak directly with our reservations team — available 24/7.",
  },
  {
    num: "03",
    title: "Confirm Your Booking",
    desc: "Receive instant confirmation with your chauffeur's details, vehicle information, and pickup specifics.",
  },
  {
    num: "04",
    title: "Enjoy Luxury Travel",
    desc: "Your uniformed chauffeur arrives on time. Sit back, relax, and experience first-class transportation.",
  },
];

const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "500+", label: "Professional Chauffeurs" },
  { number: "50K+", label: "Happy Clients" },
  { number: "40+", label: "Cities Covered" },
  { number: "4.9★", label: "Average Rating" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LimousineServicePage() {
  return (
    <>
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <LimousineServiceContent
        vehicles={vehicles}
        galleryImages={galleryImages}
        testimonials={testimonials}
        steps={steps}
        stats={stats}
        faqItems={faqItems}
      />
    </>
  );
}
