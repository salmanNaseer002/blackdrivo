"use client";

import React, { useRef, useEffect, forwardRef } from "react";
import {
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Zap,
  Users,
  Package,
  HeartPulse,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

if (
  typeof window !== "undefined" &&
  !(gsap.core as any).globals().ScrollTrigger
) {
  gsap.registerPlugin(ScrollTrigger);
}

const About = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const setRefs = (element: HTMLElement | null) => {
    sectionRef.current = element;
    if (typeof ref === "function") ref(element);
    else if (ref && "current" in ref) ref.current = element;
  };

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;

    const aboutItems = sectionRef.current.querySelectorAll(".about-item");

    // 🔥 Kill old animations and ScrollTriggers when re-entering
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf(aboutItems);

    // Animate in with ScrollTrigger
    gsap.fromTo(
      aboutItems,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: false, // allow re-trigger when coming back
        },
      }
    );

    // ✅ Cleanup when unmounting or navigating away
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(aboutItems);
    };
  }, [pathname]); // ✅ re-run when user navigates back

  const medicalImage =
    "https://placehold.co/450x450/10b981/ffffff?text=Demeta+RCM+Platform";

  const valuePropositions = [
    {
      text: "Full-Spectrum RCM: From Patient Intake to Final Collection",
      icon: Package,
    },
    {
      text: "Zero Disruption: Expert Coverage for All Medical Specialties",
      icon: HeartPulse,
    },
    { text: "Dedicated Credentialing & Payer Enrollment Experts", icon: Users },
    {
      text: "Guaranteed HIPAA and Regulatory Compliance & Audits",
      icon: ShieldCheck,
    },
    { text: "99% Accuracy and Optimized Cash Flow (A/R)", icon: TrendingUp },
    { text: "Cutting-Edge Technology & Seamless EHR Integration", icon: Zap },
  ];

  return (
    <section
      ref={setRefs}
      id="about"
      className="w-full py-16 md:py-24 bg-gray-50 transition-opacity duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Image Section */}
          <div className="flex justify-center order-2 lg:order-1 about-item">
            <div className="w-full max-w-md h-96 relative">
              <img
                src={medicalImage}
                alt="Demeta's comprehensive Revenue Cycle Management (RCM) platform."
                className="rounded-xl object-cover shadow-2xl transition duration-500 ease-in-out hover:shadow-green-400/50"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://placehold.co/450x450/10b981/ffffff?text=Demeta+RCM+Platform";
                }}
              />
              <div className="absolute top-5 left-5 p-3 rounded-full bg-white shadow-xl text-green-600">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="space-y-6 text-left order-1 lg:order-2">
            <div className="inline-block rounded-full bg-green-200 px-4 py-1 text-sm font-bold tracking-wider text-green-800 about-item">
              Meet Demeta: Your RCM Partner
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight about-item">
              Demeta: Comprehensive Billing Solutions for Every Aspect of Your
              Practice
            </h2>

            <p className="text-lg text-gray-700 max-w-xl about-item">
              Demeta offers a complete, wall-to-wall suite of services—from
              initial patient verification and detailed medical coding to
              aggressive denial management and final collections. We handle
              everything so your team can focus entirely on patient care.
            </p>

            <ul className="space-y-4 pt-2">
              {valuePropositions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-start about-item">
                    <Icon className="mr-3 mt-1 h-6 w-6 text-green-700 flex-shrink-0" />
                    <span className="text-lg text-gray-800 font-medium">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;
