"use client";

import React, { useRef, useEffect } from "react";
// NOTE: External GSAP/ScrollTrigger imports are removed for environment compatibility
// but the structural logic (useRef, useEffect) is preserved for external animation.

export default function RCMStats() {
  const statsRef = useRef<HTMLElement>(null);

  // Structural useEffect hook preserved for intended scroll-based animation trigger
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll(".stat-item");

      // The original GSAP code is omitted here because the libraries
      // are not guaranteed to be available in this single-file environment,
      // but the component structure remains ready for external animation.
      if (statItems.length > 0) {
        // console.log("RCM Stats section initialized. Ready for external animation logic.");
      }
    }
  }, []);

  return (
    <section
      ref={statsRef}
      id="stats"
      className="w-full py-12 md:py-24 bg-gray-900 text-white shadow-2xl"
    >
      <div className="w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 state-item">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {/* Stat Item 1: Practices Served (More than 50 as requested) */}
          <div className="space-y-2 stat-item">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-green-400">
              150+
            </h3>
            <p className="text-sm sm:text-lg text-gray-300 font-medium">
              Practices Served
            </p>
          </div>

          {/* Stat Item 2: Claim Success Rate */}
          <div className="space-y-2 stat-item">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-green-400">
              98%
            </h3>
            <p className="text-sm sm:text-lg text-gray-300 font-medium">
              First-Pass Claim Rate
            </p>
          </div>

          {/* Stat Item 3: Total Value Managed */}
          <div className="space-y-2 stat-item">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-green-400">
              $5M+
            </h3>
            <p className="text-sm sm:text-lg text-gray-300 font-medium">
              Revenue Managed Annually
            </p>
          </div>

          {/* Stat Item 4: Financial Improvement */}
          <div className="space-y-2 stat-item">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-green-400">
              30%
            </h3>
            <p className="text-sm sm:text-lg text-gray-300 font-medium">
              Reduction in A/R Days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
