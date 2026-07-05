import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Plane, Clock, MapPin, Briefcase, Star, Heart, Moon, CheckCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | BlackDrivo Premium Chauffeur",
  description:
    "Premium black car services: airport & seaport transfers, corporate travel, hourly chauffeur, city-to-city rides, weddings, special events, and night-on-the-town — across New York, New Jersey, and Philadelphia.",
};

const services = [
  {
    id: "airport",
    icon: Plane,
    title: "Airport & Seaport Transfers",
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
    icon: Briefcase,
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
    icon: Clock,
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
    icon: MapPin,
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
    icon: Heart,
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
    id: "nightout",
    icon: Moon,
    title: "Night on the Town",
    tagline: "Arrive. Enjoy. Repeat.",
    description:
      "Make your bachelor or bachelorette party, prom, Bar/Bat Mitzvah, graduation, or other special event an amazing night to remember. Your choice of luxury vehicle can accommodate 4 or many more, while you and your party arrive in luxury and comfort — with no worries about driving.",
    features: [
      "Bachelor & bachelorette party packages",
      "Prom & graduation night transportation",
      "Concert & sporting event transfers",
      "Stretch limousines with full bar",
      "Ambient lighting & premium audio",
      "Multiple pickup & drop-off stops",
    ],
    image: "/el-thumb-3.webp",
  },
  {
    id: "events",
    icon: Star,
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

const vehicleClasses = [
  {
    name: "Luxury Sedan",
    seats: 3,
    bags: 2,
    examples: "Mercedes S-Class, Lincoln Continental, Volvo S90",
    description: "Top-tier luxury for VIP clients, corporate, and airport transfers.",
  },
  {
    name: "Chauffeured SUV",
    seats: 6,
    bags: 5,
    examples: "Cadillac Escalade, Chevrolet Suburban, Mercedes GLS",
    description: "Premium SUVs for groups, families, and extra luggage capacity.",
  },
  {
    name: "Stretch Limousine",
    seats: 10,
    bags: 7,
    examples: "Stretch Limousine, SUV Stretch Limousine",
    description: "Classic luxury for weddings, proms, and unforgettable nights out.",
  },
  {
    name: "Executive Van & Coach",
    seats: 55,
    bags: 20,
    examples: "Mercedes Sprinter, Mini Bus, Motor Coach",
    description: "Large vans and coaches for groups, airport runs, and events.",
  },
];

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking as early as possible to ensure availability, especially during peak travel times. We do accept last-minute bookings based on availability.",
  },
  {
    q: "Do you track flights for airport pickups?",
    a: "Yes. We utilize real-time FAA flight tracking to adjust arrival times automatically for delays or early landings. Your chauffeur will be on-site and prepared the moment you deplane.",
  },
  {
    q: "How long will my chauffeur wait at the airport?",
    a: "Complimentary wait time is included for all airport pickups — typically 60 minutes for domestic flights and 90 minutes for international arrivals.",
  },
  {
    q: "Are your vehicles equipped with Wi-Fi?",
    a: "Yes. Every vehicle is equipped with high-speed Wi-Fi, chilled mineral water, and mobile charging interfaces. Specific requests for additional refreshments can be accommodated during booking.",
  },
  {
    q: "Are your chauffeurs background-checked?",
    a: "All chauffeurs undergo rigorous background checks, defensive driving certification, and non-disclosure training. They are professionals committed to absolute discretion and passenger privacy.",
  },
  {
    q: "Is luggage assistance included?",
    a: "Yes. Chauffeurs provide full-service luggage handling and door-to-door assistance for every passenger.",
  },
  {
    q: "Do you offer child seats?",
    a: "Yes, child seats can be provided upon request. Please specify during the booking process.",
  },
  {
    q: "Are pets allowed?",
    a: "We accommodate small pets in secure carriers to maintain the immaculate condition of our late-model interiors. Service animals are always permitted in accordance with all regulations.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations must be made within the specified time frame to avoid charges. Policies may vary depending on vehicle type and service. Contact our 24/7 support team for details.",
  },
  {
    q: "Can I modify my reservation?",
    a: "Yes, modifications can be made prior to your scheduled pickup time, subject to availability. Our 24/7 concierge desk is always available to assist.",
  },
  {
    q: "How do I receive my receipt?",
    a: "Digital receipts are generated automatically and delivered to your email immediately upon trip completion. Corporate partners also have access to historical billing data through a secure dashboard.",
  },
  {
    q: "Do you serve areas outside NYC?",
    a: "Yes. BlackDrivo serves New York City, New Jersey, and Philadelphia, with city-to-city service to Boston, Washington DC, and other major destinations along the East Coast.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero — video background */}
      <section className="relative flex h-[60vh] min-h-[440px] items-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/BlackDrivo%20Main%20Page%20-%202403x1603.png"
          className="absolute inset-0 h-full w-full object-cover"
          src="/herobg.mp4"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(10,15,26,0.35) 0%, rgba(10,15,26,0.80) 100%)" }}
        />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center md:px-6 lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            BlackDrivo
          </p>
          <h1 className="font-['Georgia',serif] text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Our Services
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65">
            At BlackDrivo, the client always comes first. Our focus on customer service and client
            satisfaction guarantees a professional, pleasurable ride in cities across the globe.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
          >
            Book a Ride <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Service grid */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto w-full">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">What We Offer</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900 md:text-5xl">
              Our Services
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
              Whether you are traveling for business or leisure, our chauffeurs will provide the
              ultimate relaxing experience in the safety and comfort of our top-of-the-line vehicles.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <article key={service.id} id={service.id} className="group">
                <div className="relative mb-6 h-60 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={i < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <h3 className="font-['Georgia',serif] text-2xl font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">
                  {service.tagline}
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-500">{service.description}</p>

                <ul className="mt-4 space-y-1.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0b66d1]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    href={`/booking?service=${service.id}`}
                    className="inline-flex items-center gap-2 bg-gray-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#0b66d1]"
                  >
                    Book Chauffeur <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Banner */}
      <section className="relative h-72 overflow-hidden md:h-96">
        <Image
          src="/el-image-1.webp"
          alt="BlackDrivo Fleet"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">Premium Fleet</p>
          <h2 className="font-['Georgia',serif] text-3xl font-bold text-white md:text-5xl">
            Every Vehicle. Every Occasion.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65">
            Luxury sedans, premium SUVs, executive vans, and Sprinter vans to accommodate
            individuals and groups of all sizes — maintained to pristine showroom standards.
          </p>
        </div>
      </section>

      {/* Vehicle Classes */}
      <section className="bg-gray-50 px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto w-full">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">
              Our Fleet
            </p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900">
              Vehicle Classes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
              Clients select their preferred class during reservation. We guarantee the exact category
              requested, maintained to pristine showroom standards.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vehicleClasses.map((v) => (
              <div
                key={v.name}
                className="rounded-none border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#0b66d1]/30 hover:shadow-md"
              >
                <h3 className="font-['Georgia',serif] text-lg font-bold text-gray-900">{v.name}</h3>
                <p className="mt-2 text-xs leading-5 text-gray-500">{v.description}</p>
                <div className="mt-4 space-y-1 text-xs text-gray-500">
                  <p>Up to {v.seats} passengers</p>
                  <p>{v.bags} bags</p>
                </div>
                <p className="mt-3 text-xs text-gray-400">{v.examples}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-2 border border-gray-900 px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-900 transition hover:bg-gray-900 hover:text-white"
            >
              View Full Fleet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto w-full">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0b66d1]">FAQ</p>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 w-full text-sm leading-6 text-gray-500">
              Everything you need to know about BlackDrivo's chauffeur service.
            </p>
          </div>

          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <span className="mt-0.5 shrink-0 text-[#0b66d1] transition group-open:rotate-45">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-gray-500">{faq.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Still have questions?{" "}
            <a href="tel:+18005550199" className="font-semibold text-[#0b66d1] hover:underline">
              Call us 24/7
            </a>{" "}
            or{" "}
            <Link href="/booking" className="font-semibold text-[#0b66d1] hover:underline">
              book online
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-950 px-4 py-16 text-center md:px-6 lg:px-8">
        <div className="mx-auto w-full">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#0b66d1]">
            Ready to Ride?
          </p>
          <h2 className="font-['Georgia',serif] text-3xl font-bold text-white md:text-4xl">
            Book your chauffeur today.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/50">
            Available 24 hours a day, 7 days a week, 365 days a year. Wherever you need to go,
            BlackDrivo will be there.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#0b66d1] px-8 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#0952a8]"
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+18005550199"
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-white"
            >
              Call 24/7
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
