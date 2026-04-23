// "use client";

// import { useRef, useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import gsap from "gsap";
// import Image from "next/image";

// const DemetaLogoSVG = (props: any) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 250 60"
//     fill="none"
//     {...props}
//     className={`h-10 w-auto object-contain ${props?.className || ""}`}
//   >
//     <g transform="translate(10, 5)">
//       <path
//         d="M42 42V18H31.5C21.375 18 13 26.375 13 36.5S21.375 55 31.5 55H36C45.9375 55 54 46.9375 54 37V31.5H48V37C48 43.6875 42.6875 49 36 49H31.5C24.6562 49 19.5 43.8438 19.5 37S24.6562 25 31.5 25H42V18H31.5C21.375 18 13 26.375 13 36.5S21.375 55 31.5 55H36C45.9375 55 54 46.9375 54 37V31.5H48V37C48 43.6875 42.6875 49 36 49H31.5C24.6562 49 19.5 43.8438 19.5 37S24.6562 25 31.5 25H42V18Z"
//         fill="#204F75"
//       />
//       <path
//         d="M43.5 13.5L47.5 17.5L43.5 21.5L39.5 17.5L43.5 13.5Z"
//         fill="#00A79D"
//       />
//       <path
//         d="M37.5 7.5L41.5 11.5L37.5 15.5L33.5 11.5L37.5 7.5Z"
//         fill="#5ebc66"
//       />
//     </g>
//     <rect x="75" y="10" width="2" height="40" fill="#E5E7EB" />
//     <text
//       x="85"
//       y="30"
//       fontFamily="Inter, sans-serif"
//       fontSize="20"
//       fontWeight="700"
//       fill="#204F75"
//     >
//       DEMETA
//     </text>
//     <text
//       x="85"
//       y="45"
//       fontFamily="Inter, sans-serif"
//       fontSize="10"
//       fontWeight="500"
//       fill="#5ebc66"
//     >
//       PRECISION RCM FOR HEALTHCARE
//     </text>
//   </svg>
// );

// interface HeaderProps {
//   scrollToSection: (elementRef: React.RefObject<HTMLElement | null>) => void;
//   servicesRef: React.RefObject<HTMLElement | null>;
//   aboutRef: React.RefObject<HTMLElement | null>;
//   teamRef: React.RefObject<HTMLElement | null>;
//   testimonialsRef: React.RefObject<HTMLElement | null>;
//   contactRef: React.RefObject<HTMLElement | null>;
// }

// export default function Header({
//   scrollToSection,
//   servicesRef,
//   aboutRef,
//   teamRef,
//   testimonialsRef,
//   contactRef,
// }: HeaderProps) {
//   const headerRef = useRef<HTMLElement>(null);
//   const pathname = usePathname(); // ✅ used to detect when user navigates back
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     if (!headerRef.current) return;

//     // Run GSAP animation when page mounts or route changes
//     gsap.fromTo(
//       headerRef.current,
//       { y: -100, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
//     );

//     // Cleanup: reset any inline GSAP styles when leaving
//     return () => {
//       gsap.set(headerRef.current, { clearProps: "all" });
//     };
//   }, [pathname]); // ✅ rerun on route changes (includes back/forward navigation)

//   const handleLogoClick = () => {
//     if (typeof window !== "undefined") {
//       if (window.scrollY < 50) {
//         window.location.reload();
//       } else {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       }
//     }
//   };

//   const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

//   const navItems = [
//     { name: "Services", ref: servicesRef },
//     { name: "About", ref: aboutRef },
//     { name: "Testimonials", ref: testimonialsRef },
//     { name: "Contact", ref: contactRef },
//   ];

//   return (
//     <header
//       ref={headerRef}
//       className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all"
//     >
//       <div className="w-full px-6 md:px-12 lg:px-20 flex h-16 items-center justify-between">
//         {/* Logo */}
//         <button
//           className="w-32 md:w-64 pt-1 cursor-pointer"
//           onClick={handleLogoClick}
//           aria-label="Go to top"
//         >
//           <DemetaLogoSVG />
//         </button>

//         {/* Mobile Menu Button */}
//         <div className="lg:hidden">
//           <button
//             onClick={toggleMobileMenu}
//             className="p-2 focus:outline-none"
//             aria-label="Toggle menu"
//           >
//             <div className="w-6 flex flex-col gap-1">
//               <span
//                 className={`block h-0.5 w-full bg-[#172737] transition-all duration-300 ${
//                   mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
//                 }`}
//               ></span>
//               <span
//                 className={`block h-0.5 w-full bg-[#172737] transition-all duration-300 ${
//                   mobileMenuOpen ? "opacity-0" : ""
//                 }`}
//               ></span>
//               <span
//                 className={`block h-0.5 w-full bg-[#172737] transition-all duration-300 ${
//                   mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
//                 }`}
//               ></span>
//             </div>
//           </button>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center gap-8">
//           <nav className="flex gap-6">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => scrollToSection(item.ref)}
//                 className="text-[#172737] hover:text-[#5ebc66] transition-colors font-medium"
//               >
//                 {item.name}
//               </button>
//             ))}
//           </nav>
//           <Button
//             className="bg-[#5ebc66] hover:bg-[#5ebc66]/90 text-white"
//             onClick={() => scrollToSection(contactRef)}
//           >
//             Get Started
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="lg:hidden bg-white p-4 shadow-md">
//           <nav className="flex flex-col gap-4">
//             {navItems.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   scrollToSection(item.ref);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="text-[#172737] hover:text-[#5ebc66] transition-colors py-2 text-left"
//               >
//                 {item.name}
//               </button>
//             ))}
//             <Button
//               className="bg-[#5ebc66] hover:bg-[#5ebc66]/90 text-white mt-2"
//               onClick={() => {
//                 scrollToSection(contactRef);
//                 setMobileMenuOpen(false);
//               }}
//             >
//               Get Started
//             </Button>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import Image from "next/image";

const DemetaLogoSVG = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 60"
    fill="none"
    {...props}
    className={`h-10 w-auto object-contain ${props?.className || ""}`}
  >
    <g transform="translate(10, 5)">
      <path
        d="M42 42V18H31.5C21.375 18 13 26.375 13 36.5S21.375 55 31.5 55H36C45.9375 55 54 46.9375 54 37V31.5H48V37C48 43.6875 42.6875 49 36 49H31.5C24.6562 49 19.5 43.8438 19.5 37S24.6562 25 31.5 25H42V18H31.5C21.375 18 13 26.375 13 36.5S21.375 55 31.5 55H36C45.9375 55 54 46.9375 54 37V31.5H48V37C48 43.6875 42.6875 49 36 49H31.5C24.6562 49 19.5 43.8438 19.5 37S24.6562 25 31.5 25H42V18Z"
        fill="#204F75"
      />
      <path
        d="M43.5 13.5L47.5 17.5L43.5 21.5L39.5 17.5L43.5 13.5Z"
        fill="#00A79D"
      />
      <path
        d="M37.5 7.5L41.5 11.5L37.5 15.5L33.5 11.5L37.5 7.5Z"
        fill="#5ebc66"
      />
    </g>
    <rect x="75" y="10" width="2" height="40" fill="#E5E7EB" />
    <text
      x="85"
      y="30"
      fontFamily="Inter, sans-serif"
      fontSize="20"
      fontWeight="700"
      fill="#204F75"
    >
      DEMETA
    </text>
    <text
      x="85"
      y="45"
      fontFamily="Inter, sans-serif"
      fontSize="10"
      fontWeight="500"
      fill="#5ebc66"
    >
      PRECISION RCM FOR HEALTHCARE
    </text>
  </svg>
);

interface HeaderProps {
  scrollToSection: (elementRef: React.RefObject<HTMLElement | null>) => void;
  servicesRef: React.RefObject<HTMLElement | null>;
  aboutRef: React.RefObject<HTMLElement | null>;
  teamRef: React.RefObject<HTMLElement | null>;
  testimonialsRef: React.RefObject<HTMLElement | null>;
  contactRef: React.RefObject<HTMLElement | null>;
}

export default function Header({
  scrollToSection,
  servicesRef,
  aboutRef,
  teamRef,
  testimonialsRef,
  contactRef,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    return () => {
      gsap.set(headerRef.current, { clearProps: "all" });
    };
  }, [pathname]);

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY < 50) {
        window.location.reload();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // --- UPDATED NAVIGATION ITEMS ---
  const navItems = [
    { name: "Services", ref: servicesRef, isExternal: false },
    { name: "About", ref: aboutRef, isExternal: false },
    { name: "Blog", path: "/blog", isExternal: true }, // 👈 NEW BLOG ITEM
    { name: "Testimonials", ref: testimonialsRef, isExternal: false },
    { name: "Contact", ref: contactRef, isExternal: false },
  ];
  // --- END UPDATED NAVIGATION ITEMS ---

  const handleNavItemClick = (item: (typeof navItems)[number]) => {
    if (item.isExternal && item.path) {
      // Handle navigation to the /blog route
      if (typeof window !== "undefined") {
        window.location.href = item.path;
      }
    } else if (item.ref) {
      // Handle scroll-to-section for local refs
      scrollToSection(item.ref);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all"
    >
      <div className="w-full px-6 md:px-12 lg:px-20 flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          className="w-32 md:w-64 pt-1 cursor-pointer"
          onClick={handleLogoClick}
          aria-label="Go to top"
        >
          <DemetaLogoSVG />
        </button>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1">
              <span
                className={`block h-0.5 w-full bg-[#172737] transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-[#172737] transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-[#172737] transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                // Use the new handler for both scroll and route changes
                onClick={() => handleNavItemClick(item)}
                className="text-[#172737] hover:text-[#5ebc66] transition-colors font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>
          <Button
            className="bg-[#5ebc66] hover:bg-[#5ebc66]/90 text-white"
            onClick={() =>
              handleNavItemClick(navItems.find((i) => i.name === "Contact")!)
            }
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white p-4 shadow-md">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item)}
                className="text-[#172737] hover:text-[#5ebc66] transition-colors py-2 text-left"
              >
                {item.name}
              </button>
            ))}
            <Button
              className="bg-[#5ebc66] hover:bg-[#5ebc66]/90 text-white mt-2"
              onClick={() =>
                handleNavItemClick(navItems.find((i) => i.name === "Contact")!)
              }
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
