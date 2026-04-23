"use client";

import { forwardRef } from "react";
import Lottie from "lottie-react";
import Image from "next/image";
import cardiologyAnimation from "@/public/animations/cardiology.json";
import neurologyAnimation from "@/public/animations/neurology.json";
import endocrinology from "@/public/animations/endocrinology.json";
import nephrologyAnimation from "@/public/animations/nephrology.json";
import publicSectorAnimation from "@/public/animations/public-sector.json";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const serviceCards = [
  {
    animation: cardiologyAnimation,
    title: "Cardiology Billing",
    description:
      "Accurate and timely billing for cardiology practices, ensuring compliance and faster reimbursements.",
  },
  {
    animation: endocrinology,
    title: "Endocrinology Billing",
    isIt: true,
    src: "/endocranology.svg",
    description:
      "Tailored medical billing solutions for endocrinologists, managing claims efficiently and minimizing errors.",
  },
  {
    animation: neurologyAnimation,
    title: "Neurology Billing",
    description:
      "Comprehensive billing services for neurology, including coding, claim submission, and denial management.",
  },
  {
    animation: nephrologyAnimation,
    title: "Nephrology Billing",
    description:
      "Specialized billing services for nephrology practices to maximize revenue and reduce administrative burden.",
  },
  {
    animation: "obgynAnimation",
    title: "OB/GYN Billing",
    isIt: true,
    src: "/obgyn.svg",
    description:
      "Expert OB/GYN billing services covering procedures, consultations, and follow-up care claims accurately.",
  },
  {
    animation: "radiologyAnimation",
    title: "Radiology Billing",
    isIt: true,
    src: "/radialogy.svg",
    description:
      "End-to-end radiology billing solutions including imaging services, coding, and insurance follow-ups.",
  },
  {
    animation: "urologyAnimation",
    title: "Urology Billing",
    isIt: true,
    src: "/urology.svg",
    description:
      "Streamlined billing services for urology practices, ensuring proper coding and quick reimbursements.",
  },
  {
    animation: publicSectorAnimation,
    title: "Public Sector Healthcare",
    description:
      "Medical billing solutions for public sector healthcare institutions, ensuring compliance and efficiency.",
  },
];

const Services = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      id="services"
      className="w-full py-0 md:py-24 bg-[lightgray]/30"
    >
      <div
        className="w-full px-8 md:px-16 lg:px-24"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#76c1a1]/20 px-3 text-lg text-[#000]">
              Our Services
            </div>
            <h2 className="heading-2 text-[#172737]">
              We Provide Comprehensive <br /> Medical Billing Services
            </h2>
            <p className="max-w-[900px] text-lg text-[#848b94]">
              Demeta offers tailored medical billing services for each
              specialty, including accurate coding, claims submission, and
              revenue cycle management:
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((service, index) => (
            <div
              key={index}
              className="service-card relative overflow-hidden bg-background p-6 shadow-lg h-[340px] flex flex-col items-start"
              data-aos="fade-up"
              data-aos-delay={index * 30}
              data-aos-duration="600"
            >
              <div className="flex items-center justify-center">
                {service.isIt ? (
                  <Image
                    src={service.src}
                    width={60}
                    height={60}
                    alt="Medical Services"
                    className="rounded-lg object-contain shadow-xl"
                    priority
                    style={{ marginBottom: "8px" }}
                  />
                ) : (
                  <Lottie
                    animationData={service?.animation}
                    loop
                    autoplay
                    className="h-20 w-20"
                  />
                )}
              </div>
              <h3 className="heading-5 text-[#172737] mb-2 group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-base text-[#848b94] group-hover:text-white/90 transition-colors duration-300 flex-grow">
                {service.description}
              </p>
              <Link
                href="#contact"
                className="absolute bottom-10 right-4 flex items-center text-[#5ebc66] font-medium"
              >
                <span className="font-medium">Learn more</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Services.displayName = "Services";

export default Services;
