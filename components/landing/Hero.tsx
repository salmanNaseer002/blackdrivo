"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { FlipWords } from "../ui/flip-words";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const words = [
    "AI Billing",
    "Automation",
    "Analytics",
    "EHR Integration",
    "Denial Management",
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (heroRef.current) {
      const heroContent = heroRef.current.querySelectorAll(".animate-item");
      gsap.fromTo(
        heroContent,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
        }
      );
    }
  }, [pathname]);

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/herobg.mp4" type="video/mp4" />
        </video>
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#a6f0c0]/80 via-[#5ebc66]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex h-[45rem] w-full items-center justify-center">
        <div className="w-full px-6 md:px-10 lg:px-24">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <div className="space-y-6 max-w-xl">
              <div className="inline-block rounded-full bg-[#d3f3d6]/70 backdrop-blur-md px-4 py-1 text-sm font-medium text-[#0b2b1f] animate-item shadow-sm">
                End-to-End Medical Services
              </div>

              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-semibold leading-tight text-white animate-item drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Transform Your Practice with Modern Medical Billing{" "}
                <span className="text-[#d0f7c4]">
                  <FlipWords words={words} duration={2200} />
                </span>
              </h1>

              <p className="text-lg text-white/85 animate-item leading-relaxed max-w-lg">
                Demeta delivers all-in-one medical billing and coding services
                for healthcare providers across the U.S. Our certified billers
                and coders recover aged receivables, resolve insurance claim
                denials, and optimize your revenue cycle management — so you get
                paid faster and focus on patient care.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-item pt-2">
                <a href="#contact">
                  <Button
                    size="lg"
                    className="bg-[#5ebc66] hover:bg-[#4aa356] text-white font-semibold px-6 py-3 shadow-md hover:shadow-lg transition-all"
                    aria-label="Get started — contact our team"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>

                <a href="#services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white bg-transparent text-white hover:bg-white/20 font-semibold px-6 py-3 backdrop-blur-md transition-all"
                    aria-label="Learn more about our services"
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center animate-item">
              <div className="relative w-full h-[900px] md:h-[550px] lg:h-[600px] rounded-2xl p-3">
                <Image
                  src="https://medexabilling.com/storage/2025/09/Untitled-design-61.png"
                  fill
                  alt="Medical billing professional illustration"
                  className="object-contain rounded-xl"
                  priority
                />
                {/* Soft glow overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
