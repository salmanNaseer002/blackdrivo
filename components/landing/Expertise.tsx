"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { expertiseData } from "./expertiseData";
import Lottie from "lottie-react";
import aiAnimation from "@/public/animations/ai.json";
import enterpriseAnimation from "@/public/animations/enterprise.json";
import blockchainAnimation from "@/public/animations/blockchain.json";
import billAnimation from "@/public/animations/bill.json";
import revenueAnimation from "@/public/animations/revenue.json";

export default function Expertise() {
  // ✅ Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800, // faster than before
      once: true, // animate only once when scrolled into view
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* ------------------ Heading ------------------ */}
        <div className="mb-16" data-aos="fade-down">
          <h2 className="text-4xl font-bold text-[#172737]">Expertise</h2>
          <div className="w-44 h-[2px] bg-[#172737] mt-2 mb-4"></div>
          <p className="text-lg text-gray-600">
            We leverage IT intelligence to create innovative Medical Billing &
            Healthcare Software Solutions that streamline operations, ensure
            compliance, and maximize revenue for healthcare providers.
          </p>
        </div>

        {/* ------------------ Content Section ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Image / Illustration */}
          <div className="relative flex justify-center" data-aos="fade-right">
            <Image
              src="/medical.webp"
              alt="Custom Software Solutions"
              width={600}
              height={600}
              className="w-[100%] md:w-[430] lg:w-[430] h-auto drop-shadow-2xl"
            />
          </div>

          <div className="space-y-6" data-aos="fade-left">
            <p className="uppercase text-[#5ebc66] text-xl font-semibold tracking-wider mb-2">
              Medical Billing & Healthcare Software Solutions
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-[#172737] mt-0">
              {expertiseData.sectionOne.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {expertiseData.sectionOne.description}
            </p>

            <ul className="space-y-3">
              {expertiseData.sectionOne.points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start text-[#172737]"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <span className="mt-[2px] mr-3 text-[#5ebc66]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* <Link
              href="#"
              className="inline-block border border-[#5ebc66] text-[#5ebc66] px-5 py-2 rounded-full font-medium transition-all duration-300 hover:bg-[#5ebc66] hover:text-white"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              More Details
            </Link> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-30">
          <div className="space-y-6" data-aos="fade-left">
            <p className="uppercase text-[#5ebc66] text-xl font-semibold tracking-wider mb-2">
              Accelerate Your Cash Flow
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-[#172737] mt-0">
              {expertiseData.sectionTwo.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {expertiseData.sectionTwo.description}
            </p>

            <ul className="space-y-3">
              {expertiseData.sectionTwo.points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start text-[#172737]"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <span className="mt-[2px] mr-3 text-[#5ebc66]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center" data-aos="fade-right">
            <Image
              src="/collect.webp"
              width={500}
              height={600}
              alt="Medical Services"
              className="rounded-lg object-contain shadow-xl"
              priority
              style={{ marginBottom: "8px" }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-30">
          {/* Left Image / Illustration */}
          <div className="relative flex justify-center" data-aos="fade-right">
            <Lottie
              animationData={billAnimation}
              loop
              autoplay
              className="w-[430px] h-[430px] md:w-[430] md:h-[430]"
            />
          </div>

          <div className="space-y-6" data-aos="fade-left">
            <p className="uppercase text-[#5ebc66] text-xl font-semibold tracking-wider mb-2">
              Medical Billing and RCM
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-[#172737] mt-0">
              {expertiseData.sectionThree.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {expertiseData.sectionThree.description}
            </p>

            <ul className="space-y-3">
              {expertiseData.sectionThree.points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start text-[#172737]"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <span className="mt-[2px] mr-3 text-[#5ebc66]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-30">
          <div className="space-y-6" data-aos="fade-left">
            <p className="uppercase text-[#5ebc66] text-xl font-semibold tracking-wider mb-2">
              Revenue
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-[#172737] mt-0">
              {expertiseData.sectionFour.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {expertiseData.sectionFour.description}
            </p>

            <ul className="space-y-3">
              {expertiseData.sectionFour.points.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start text-[#172737]"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <span className="mt-[2px] mr-3 text-[#5ebc66]">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center" data-aos="fade-right">
            <Lottie
              animationData={revenueAnimation}
              loop
              autoplay
              className="w-[430px] h-[430px] md:w-[430] md:h-[430]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
