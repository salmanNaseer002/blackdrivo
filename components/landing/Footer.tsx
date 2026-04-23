"use client";

import React, { useRef, useEffect, forwardRef, useCallback } from "react"; // Added useCallback
import Link from "next/link";
import { Twitter, Linkedin } from "lucide-react";

// Link Component replacement for compatibility, updated to handle smooth scrolling
const SimpleLink = ({ href, className, target, children }: any) => {
  const handleClick = useCallback(
    (event: any) => {
      // Check if the link is an internal fragment link (e.g., #about)
      if (href && href.startsWith("#")) {
        event.preventDefault();
        const targetElement = document.getElementById(href.substring(1));
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
      // If it's an external link or a simple #, let default behavior continue
    },
    [href]
  );

  return (
    <a href={href} className={className} target={target} onClick={handleClick}>
      {children}
    </a>
  );
};

const Footer = forwardRef<HTMLElement>((props, ref) => {
  // Wrapped component in forwardRef
  const sectionRef = useRef<HTMLElement>(null);

  // Combine the forwarded ref with our local ref
  const setRefs = (element: HTMLElement | null) => {
    // Update our local ref
    if (sectionRef.current !== element) {
      sectionRef.current = element;
    }
    // Forward the ref, handling both function and object ref types
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = element;
    }
  };

  // Placeholder for animation/effect logic if required later
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sectionRef.current) {
      // Logic for animations or other side effects related to the footer element
    }
  }, []);

  return (
    <footer
      ref={setRefs}
      className="w-full border-t bg-[#172737] text-white py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:gap-20 lg:grid-cols-4 lg:place-items-start p-2">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="font-bold text-xl text-white">DM</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Demeta
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Precision Revenue Cycle Management (RCM) designed to maximize
              collections and financial health for healthcare providers.
            </p>
          </div>

          {/* RCM Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">RCM Services</h3>
            <ul className="space-y-3 text-base text-gray-400">
              <li>
                <SimpleLink
                  href="#services"
                  className="hover:text-blue-400 transition-colors"
                >
                  Claim Submission & Tracking
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#services"
                  className="hover:text-blue-400 transition-colors"
                >
                  Denial Management
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#services"
                  className="hover:text-blue-400 transition-colors"
                >
                  A/R Follow-up
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#services"
                  className="hover:text-blue-400 transition-colors"
                >
                  Payer Credentialing
                </SimpleLink>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-3 text-base text-gray-400">
              <li>
                <SimpleLink
                  href="#about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Demeta
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#stats"
                  className="hover:text-blue-400 transition-colors"
                >
                  Success Metrics
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#testimonials"
                  className="hover:text-blue-400 transition-colors"
                >
                  Client Testimonials
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </SimpleLink>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="flex flex-col space-y-3 text-base text-gray-400">
              <Link href="/hipaa-compliance">HIPAA Compliance</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/blog">Blog & Insights</Link>
              {/* <li>
                <SimpleLink
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  HIPAA Compliance
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </SimpleLink>
              </li>
              <li>
                <SimpleLink
                  href="#"
                  className="hover:text-blue-400 transition-colors"
                >
                  Blog & Insights
                </SimpleLink>
              </li> */}
            </ul>
          </div>
        </div>

        {/* Copyright and Social Media */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Demeta RCM Solutions. All rights
            reserved.
          </p>
          <div className="flex space-x-5 mt-4 md:mt-0">
            <SimpleLink
              href="https://www.linkedin.com/company/demetasolutions"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </SimpleLink>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "FooterDemeta";

export default Footer;
