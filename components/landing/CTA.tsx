// "use client";

// import { useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { ChevronRight, HeartPulse } from "lucide-react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// export default function CTA() {
//   const ctaRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     if (!ctaRef.current) return;

//     // Create a GSAP context to safely scope animations
//     const ctx = gsap.context(() => {
//       const ctaItems = ctaRef.current?.querySelectorAll(".cta-item");

//       gsap.fromTo(
//         ctaItems,
//         { opacity: 0, y: 40 },
//         {
//           opacity: 1,
//           y: 0,
//           stagger: 0.2,
//           duration: 1,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: ctaRef.current,
//             start: "top 85%",
//             once: false, // rerun when navigating back
//           },
//         }
//       );
//     }, ctaRef);

//     // ✅ Cleanup only this component’s animations
//     return () => ctx.revert();
//   }, []);

//   return (
//     <section
//       ref={ctaRef}
//       id="cta"
//       className="w-full py-16 md:py-24 bg-[#172737] text-white relative overflow-hidden"
//     >
//       {/* Background overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a3a] via-[#172737] to-[#101b27] opacity-95" />

//       <div className="relative w-full px-8 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center space-y-8 z-10">
//         <div className="flex flex-col items-center gap-3">
//           <div className="p-3 bg-[#5ebc66]/20 rounded-full shadow-lg cta-item">
//             <HeartPulse className="h-10 w-10 text-[#5ebc66]" />
//           </div>
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[#eaf5ec] cta-item">
//             Let’s Optimize Your Practice Revenue
//           </h2>
//         </div>

//         <p className="max-w-3xl text-lg sm:text-xl text-[#c5ddca] leading-relaxed cta-item">
//           From patient eligibility to denial management, we help healthcare
//           providers boost revenue, reduce errors, and streamline billing with
//           precision and compliance.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-3 cta-item">
//           <a href="#contact" className="contents">
//             <Button
//               size="lg"
//               className="bg-[#5ebc66] hover:bg-[#4ea758] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-green-500/30 transition-all duration-300"
//               aria-label="Get started with medical billing services"
//             >
//               Schedule Free Consultation
//               <ChevronRight className="ml-2 h-4 w-4" />
//             </Button>
//           </a>
//           <a href="#services" className="contents">
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-[#c5ddca] text-[#c5ddca] hover:text-[#5ebc66] hover:border-[#5ebc66] hover:bg-[#5ebc66]/10 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
//               aria-label="Learn more about medical billing services"
//             >
//               Explore Our Services
//             </Button>
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, HeartPulse } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The ScrollTrigger plugin registration should use a safe check
// but since the original code only checked for 'window', I will stick to that logic.
if (typeof window !== "undefined") {
  // Use a type assertion if the definition files are strict
  // Checking if ScrollTrigger is already registered prevents double-registration warnings
  if (!(gsap.core as any).globals().ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export default function CTA() {
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Basic check for early return
    if (!ctaRef.current) return;

    // Create a GSAP context to safely scope animations
    const ctx = gsap.context(() => {
      // FIX: Use a non-null assertion (!) here.
      // Since we checked 'ctaRef.current' is not null above, we are asserting to TypeScript
      // that the result will be a NodeListOf<Element> and not 'undefined'.
      const ctaItems = ctaRef.current!.querySelectorAll(".cta-item");

      gsap.fromTo(
        // ctaItems is now correctly typed as NodeListOf<Element>
        ctaItems,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            once: false, // rerun when navigating back
          },
        }
      );
    }, ctaRef);

    // ✅ Cleanup only this component’s animations
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ctaRef}
      id="cta"
      className="w-full py-16 md:py-24 bg-[#172737] text-white relative overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b2a3a] via-[#172737] to-[#101b27] opacity-95" />

      <div className="relative w-full px-8 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center space-y-8 z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-[#5ebc66]/20 rounded-full shadow-lg cta-item">
            <HeartPulse className="h-10 w-10 text-[#5ebc66]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[#eaf5ec] cta-item">
            Let’s Optimize Your Practice Revenue
          </h2>
        </div>

        <p className="max-w-3xl text-lg sm:text-xl text-[#c5ddca] leading-relaxed cta-item">
          From patient eligibility to denial management, we help healthcare
          providers boost revenue, reduce errors, and streamline billing with
          precision and compliance.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 cta-item">
          <a href="#contact" className="contents">
            <Button
              size="lg"
              className="bg-[#5ebc66] hover:bg-[#4ea758] text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-green-500/30 transition-all duration-300"
              aria-label="Get started with medical billing services"
            >
              Schedule Free Consultation
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="#services" className="contents">
            <Button
              size="lg"
              variant="outline"
              className="border-[#c5ddca] text-[#c5ddca] hover:text-[#5ebc66] hover:border-[#5ebc66] hover:bg-[#5ebc66]/10 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              aria-label="Learn more about medical billing services"
            >
              Explore Our Services
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
