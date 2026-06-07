import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, CheckCircle, Phone, Star, Users, Briefcase,
  Clock, Shield, Award, Globe, Headphones, CreditCard,
  ChevronDown, Plane, Heart, Music, MessageCircle, Building2,
} from "lucide-react";
import type { Metadata } from "next";

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

const whyChoose = [
  {
    icon: Award,
    title: "Professional Chauffeurs",
    desc: "Uniformed, background-checked, and trained to the highest luxury service standards.",
  },
  {
    icon: Plane,
    title: "Real-Time Flight Tracking",
    desc: "We monitor every flight. Delays never leave our clients stranded — ever.",
  },
  {
    icon: Clock,
    title: "Guaranteed On-Time",
    desc: "Punctuality is not a promise — it is our operational standard on every single trip.",
  },
  {
    icon: CreditCard,
    title: "Fixed Transparent Pricing",
    desc: "Your price is locked at booking. No surge charges, no surprises, guaranteed.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    desc: "Round-the-clock human support via phone, live chat, and WhatsApp — always available.",
  },
  {
    icon: Globe,
    title: "Worldwide Coverage",
    desc: "Local expertise in 40+ US cities and international destinations worldwide.",
  },
  {
    icon: Building2,
    title: "Corporate Billing",
    desc: "Monthly invoicing, dedicated account management, and priority booking for businesses.",
  },
  {
    icon: Shield,
    title: "Fully Licensed & Insured",
    desc: "Every vehicle and chauffeur is fully licensed, insured, and compliant in every state.",
  },
];

const occasions = [
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Flight-tracked luxury pickups from every major US airport. Professional meet & greet available at arrivals.",
  },
  {
    icon: Building2,
    title: "Corporate Travel",
    desc: "Executive ground transportation for business leaders, roadshows, investor meetings, and client events.",
  },
  {
    icon: Heart,
    title: "Weddings",
    desc: "Elegant bridal transportation that creates memories lasting a lifetime — for the entire wedding party.",
  },
  {
    icon: Star,
    title: "Prom & Special Events",
    desc: "Unforgettable luxury experiences for life's milestone celebrations, proms, and sweet sixteens.",
  },
  {
    icon: Shield,
    title: "VIP Transportation",
    desc: "Discreet, premium transport for executives, celebrities, dignitaries, and high-profile clients.",
  },
  {
    icon: Music,
    title: "Night Out in the City",
    desc: "Luxury city experiences without the stress of driving, parking, or planning — just pure enjoyment.",
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
    <div className="min-h-screen bg-white">
      {/* Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Background video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster="/STRETCH LIMOUSINE.jpg"
          >
            <source src="/herobg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-32 md:px-8 md:py-44">
          <div className="max-w-3xl">
            {/* eyebrow */}
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              <span className="h-px w-8 bg-[#C5A028]" />
              Premium Limousine Service
            </p>

            {/* H1 */}
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              Luxury Limousine<br className="hidden sm:block" />
              <span className="text-[#C5A028]">Service</span> Worldwide
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              Travel in comfort, elegance, and style with BlackDrivo's premium limousine fleet. Perfect
              for airport transfers, weddings, corporate events, and VIP transportation.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-[#C5A028] px-8 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#A8871E]"
              >
                Book Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:border-[#C5A028] hover:text-[#C5A028]"
              >
                Get Instant Quote
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { icon: Award,     label: "Pro Chauffeurs"  },
                  { icon: Plane,     label: "Flight Tracking" },
                  { icon: CreditCard, label: "Fixed Pricing"  },
                  { icon: Headphones, label: "24/7 Support"   },
                ] as const
              ).map(badge => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 border border-white/15 bg-black/30 px-4 py-3 backdrop-blur-sm"
                >
                  <badge.icon className="h-4 w-4 shrink-0 text-[#C5A028]" />
                  <span className="text-xs font-semibold text-white">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── VEHICLE SHOWCASE ──────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">Our Fleet</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Premium Limousine Fleet
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              Every vehicle is meticulously maintained, fully equipped, and driven by a professional
              uniformed chauffeur trained to the highest service standards.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          {/* Vehicle cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {vehicles.map(v => (
              <div
                key={v.name}
                className="group overflow-hidden border border-gray-100 bg-white shadow-sm transition duration-300 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Tagline badge */}
                  <div className="absolute left-4 top-4">
                    <span className="bg-[#C5A028] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-black">
                      {v.tagline}
                    </span>
                  </div>

                  {/* Capacity chips */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Users className="h-3.5 w-3.5 text-[#C5A028]" />
                      {v.passengers}
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Briefcase className="h-3.5 w-3.5 text-[#C5A028]" />
                      {v.bags}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="text-xl font-extrabold text-gray-900">{v.name}</h3>
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {v.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[#C5A028]" />
                        <span className="text-xs text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex gap-3">
                    <Link
                      href="/booking"
                      className="flex flex-1 items-center justify-center gap-2 bg-[#0b66d1] py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
                    >
                      Book This Vehicle <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/fleet"
                      className="inline-flex items-center justify-center border border-gray-200 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-600 transition hover:border-[#C5A028] hover:text-[#C5A028]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See full fleet CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 border border-gray-200 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-gray-700 transition hover:border-[#C5A028] hover:text-[#C5A028]"
            >
              View Full Fleet <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE BLACKDRIVO ─────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-[#FAFAFA] px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Why BlackDrivo
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              The BlackDrivo Difference
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              Eight reasons why discerning travelers, executives, and luxury clients choose BlackDrivo
              over every other limousine service.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map(item => (
              <div
                key={item.title}
                className="border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:border-[#C5A028]/40 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-[#FBF6E9]">
                  <item.icon className="h-5 w-5 text-[#C5A028]" />
                </div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OCCASIONS ────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Every Occasion
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Limousine Service for Every Event
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
              From the world's busiest airports to your most intimate celebrations — BlackDrivo
              delivers luxury transportation precisely when and where you need it.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map(o => (
              <div
                key={o.title}
                className="group relative overflow-hidden bg-gray-900 p-8 transition duration-300 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-gray-900/90" />
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#C5A028]/5 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#C5A028]/3 blur-xl" />

                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#C5A028]/30 bg-[#C5A028]/10">
                    <o.icon className="h-5 w-5 text-[#C5A028]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{o.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-white/55">{o.desc}</p>
                  <Link
                    href="/booking"
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C5A028] transition group-hover:gap-3"
                  >
                    Book Now <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Fleet Gallery
            </p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              Experience the Difference
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
              Explore our fleet inside and out — exterior elegance and interior luxury in every detail.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          {/* Masonry-style grid */}
          <div className="grid auto-rows-[180px] grid-cols-2 gap-2 md:grid-cols-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${img.tall ? "row-span-2" : "row-span-1"}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition duration-700 hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/25 transition duration-300 hover:bg-black/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Client Reviews
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              4.9 stars from 847+ verified reviews. Trusted by executives, celebrities, and discerning
              travelers worldwide.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="flex flex-col border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C5A028] text-[#C5A028]" />
                  ))}
                </div>

                {/* Review text */}
                <blockquote className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-900 text-sm font-extrabold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{t.name}</p>
                    <p className="text-xs text-[#C5A028]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-4 py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
              Simple Process
            </p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
              Booking your luxury limousine with BlackDrivo takes less than two minutes.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-[#C5A028]/20 lg:block" />
                )}

                {/* Step number */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#C5A028]/30 bg-[#C5A028]/10 text-2xl font-extrabold text-[#C5A028]">
                  {s.num}
                </div>
                <h3 className="mt-5 font-extrabold text-white">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-white/50">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#C5A028] px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#A8871E]"
            >
              Start Your Booking <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-4 py-20 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-10 text-center md:grid-cols-5">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold text-[#C5A028] md:text-5xl">{s.number}</div>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/40">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">FAQ</p>
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
              Everything you need to know about BlackDrivo limousine service — answered honestly.
            </p>
            <div className="mx-auto mt-5 h-0.5 w-14 bg-[#C5A028]" />
          </div>

          <div className="space-y-2">
            {faqItems.map(item => (
              <details
                key={item.q}
                className="group border border-gray-100 bg-white open:border-[#C5A028]/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50">
                  <span>{item.q}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#C5A028] transition duration-300 group-open:rotate-180" />
                </summary>
                <div className="border-t border-gray-100 px-6 py-5 text-sm leading-7 text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-[#FAFAFA] px-4 py-24 md:px-8">
        <div className="mx-auto max-w-4xl space-y-8 text-sm leading-8 text-gray-600">

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Luxury Limousine Service You Can Trust
            </h2>
            <p>
              BlackDrivo is America's premier luxury limousine service, providing world-class
              transportation for executives, celebrities, wedding parties, and discerning travelers who
              demand excellence in every mile. Our fleet of meticulously maintained limousines, combined
              with our team of professionally trained, uniformed chauffeurs, sets the standard for luxury
              ground transportation across the United States and beyond.
            </p>
            <p className="mt-4">
              When you choose BlackDrivo's limousine service, you are choosing far more than a vehicle.
              You are choosing a complete luxury travel experience — from the moment you make your
              reservation to the moment your chauffeur drops you at your destination. Every interaction,
              every vehicle, and every chauffeur reflects our unwavering commitment to five-star quality,
              absolute punctuality, and genuine hospitality.
            </p>
            <p className="mt-4">
              Our limousine service is available 24 hours a day, seven days a week, 365 days a year.
              Whether you need an airport pickup at 3 AM, a wedding limousine on a Saturday afternoon,
              or an executive transfer during peak rush hour, BlackDrivo is always ready. Our operations
              team monitors every booking in real time, ensuring nothing falls through the cracks and
              every client experience is flawless.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Airport Limousine Service: Stress-Free Travel Starts Here
            </h2>
            <p>
              Airport transfers represent one of the most stressful travel scenarios for any traveler —
              missed flights, surge-priced rideshares, unreliable taxis, and the chaos of major airports
              can turn any journey into an ordeal. BlackDrivo's airport limousine service eliminates that
              stress entirely, replacing it with calm, professional, and punctual luxury transportation.
            </p>
            <p className="mt-4">
              Our airport limousine service is built around three core principles: real-time flight
              tracking, guaranteed fixed pricing, and professional meet-and-greet service. When your
              flight lands — whether on time, early, or delayed — your chauffeur is already adjusted and
              waiting. For domestic arrivals, we provide 60 minutes of complimentary wait time. For
              international arrivals, we extend that to 90 minutes to ensure you have ample time to clear
              customs and collect your luggage without any pressure whatsoever.
            </p>
            <p className="mt-4">
              We serve 30+ major US airports including JFK, LaGuardia, Newark, LAX, O'Hare, Miami
              International, Dallas/Fort Worth, Las Vegas Harry Reid, Boston Logan, and many more.
              Whether you are arriving for a business meeting or departing for a long-awaited vacation,
              BlackDrivo's airport limousine ensures your journey begins and ends in first-class comfort.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Wedding Limousine Service: Make Your Day Unforgettable
            </h2>
            <p>
              Your wedding day is one of the most important days of your life, and the details matter
              enormously. BlackDrivo's wedding limousine service is designed to ensure that your
              transportation is not just reliable — it is genuinely extraordinary. From the moment the
              bridal party is picked up to the final farewell as the newlyweds depart the reception,
              every element of your wedding transportation is handled with grace, professionalism, and
              impeccable attention to detail.
            </p>
            <p className="mt-4">
              Our wedding fleet includes our classic stretch limousines, capable of accommodating up to
              10 passengers for the bridal party, as well as our luxury Mercedes Sprinter for larger
              groups. All vehicles can be tastefully decorated with ribbons, flowers, or custom signage
              to match your wedding aesthetic. Your chauffeur will be formally attired, punctual, and
              fully briefed on your wedding day itinerary — including the ceremony venue, photography
              locations, and reception destination.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Corporate Limousine Service for Business Leaders
            </h2>
            <p>
              In the business world, time is the most valuable resource, and your ground transportation
              should respect that. BlackDrivo's corporate limousine service provides executives, business
              travelers, and corporate groups with reliable, professional, and comfortable transportation
              that keeps pace with the demands of modern business travel.
            </p>
            <p className="mt-4">
              Our corporate accounts offer monthly billing, priority booking, dedicated account
              management, and detailed expense reporting — everything your finance and travel teams need
              to manage corporate transportation efficiently. Our executive fleet, including the Mercedes
              Luxury Sprinter with its conference-ready seating layout, allows busy executives to work
              productively during transit, turning every ride into a productive extension of the
              boardroom.
            </p>
            <p className="mt-4">
              For corporate roadshows, investor presentations, and multi-location itineraries, our
              full-day limousine hire packages provide exceptional value and the flexibility to adapt to
              changing schedules without penalty. BlackDrivo serves Fortune 500 companies, leading law
              firms, major financial institutions, and high-growth startups across the United States.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              VIP Limousine Service: Privacy and Discretion Guaranteed
            </h2>
            <p>
              For high-profile clients who require an elevated standard of privacy, security, and
              discretion, BlackDrivo's VIP limousine service represents the pinnacle of luxury ground
              transportation. Our VIP chauffeurs are selected from the top tier of our driver pool,
              with additional training in confidentiality protocols, security awareness, and high-profile
              client management.
            </p>
            <p className="mt-4">
              Our VIP limousine fleet features vehicles with full privacy tinting, partition screens, and
              all communications technology disabled in the passenger compartment upon request. We have
              served executives, artists, athletes, diplomats, and international visitors across all
              major US cities — delivering the kind of quiet, confident professionalism that true VIP
              clients expect and deserve.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Our Premium Limousine Fleet: Built for Every Occasion
            </h2>
            <p>
              BlackDrivo's limousine fleet is carefully curated to meet the diverse needs of our
              clientele. Our <strong className="text-gray-900">Stretch Limousines</strong>, based on
              Lincoln Town Car, Cadillac DTS, and Chrysler 300 platforms, are the iconic choice for
              weddings, proms, and milestone celebrations — seating up to 10 passengers in absolute
              luxury with LED fiber optic lighting, full wet bars, premium sound systems, and privacy
              partitions.
            </p>
            <p className="mt-4">
              Our <strong className="text-gray-900">Mercedes Luxury Sprinter Limos</strong> represent
              the next evolution in group luxury transportation. Seating up to 14 passengers in
              individual executive captain chairs, featuring twin flat-screen televisions, a built-in
              refrigerator, privacy shades, and 7 feet of standing room, the Sprinter Limo is the
              preferred choice for corporate groups, wedding parties, and VIP event transportation.
            </p>
            <p className="mt-4">
              For those who prefer the power and presence of a <strong className="text-gray-900">Cadillac Escalade</strong>,
              our Escalade limousine configuration delivers an extraordinary VIP experience with heated
              and cooled leather seating, Harman Kardon premium audio, LED fiber optic ceiling lighting,
              and a full bar area — all delivered with the commanding presence that only a Cadillac can provide.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-extrabold text-gray-900 md:text-3xl">
              Luxury Limousine Service Nationwide — Available in 40+ Cities
            </h2>
            <p>
              BlackDrivo's luxury limousine service is available across the United States, with
              operations in all major metropolitan areas. From New York City and New Jersey to Los
              Angeles, Chicago, Miami, Dallas, Las Vegas, Phoenix, Seattle, Denver, and Boston — our
              network of professional chauffeurs and premium vehicles is ready to serve you wherever your
              travels take you.
            </p>
            <p className="mt-4">
              All BlackDrivo limousine pricing is completely fixed at the time of booking, regardless of
              traffic, weather, or demand. This means you always know exactly what you will pay before
              your trip begins — no surprises, no surge charges, and no unpleasant invoices after the
              fact. We believe transparent, honest pricing is the foundation of a genuine luxury
              experience.
            </p>
            <p className="mt-4">
              Ready to experience the BlackDrivo difference? Book your luxury limousine online in minutes
              or call our reservations team 24/7 at +1 (800) 555-0199. Our team is standing by to help
              you plan the perfect transportation experience — whether it is a single airport transfer or
              a complex multi-day corporate itinerary. BlackDrivo: where luxury meets reliability.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-4 py-28 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#C5A028]">
            Reserve Your Limousine
          </p>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            Experience First-Class<br className="hidden md:block" /> Limousine Travel
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/55">
            Reserve your luxury limousine today and travel with total confidence.
            Professional chauffeurs · Fixed pricing · 24/7 support
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#C5A028] px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-[#A8871E]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:border-[#C5A028] hover:text-[#C5A028]"
            >
              Get a Quote
            </Link>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="tel:+18005550199"
              className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <Phone className="h-4 w-4 text-[#C5A028]" />
              +1 (800) 555-0199
            </a>
            <span className="hidden text-white/20 sm:block">·</span>
            <a
              href="https://wa.me/18005550199"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-[#C5A028]" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────────────── */}
      <a
        href="https://wa.me/18005550199"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition hover:scale-110 hover:shadow-2xl"
      >
        <MessageCircle className="h-6 w-6 fill-white text-white" />
      </a>

      <Footer />
    </div>
  );
}
