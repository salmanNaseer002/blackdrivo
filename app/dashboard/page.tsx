"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HeroSection from "@/components/dashboard/HeroSection";
import LowerSections from "@/components/dashboard/LowerSections";
import ServicesCarouselSection from "@/components/dashboard/ServicesCarouselSection";
import SiteFooter from "@/components/dashboard/SiteFooter";
import { serviceMenuItems } from "@/components/dashboard/data";

export default function DashboardPage() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsHeaderSolid(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#0e1118]">
      <DashboardHeader
        isHeaderSolid={isHeaderSolid}
        isServicesOpen={isServicesOpen}
        setIsServicesOpen={setIsServicesOpen}
        serviceMenuItems={serviceMenuItems}
      />
      <HeroSection />
      <main className="pb-16">
        <ServicesCarouselSection />
        <LowerSections />
      </main>
      <SiteFooter />
    </div>
  );
}
