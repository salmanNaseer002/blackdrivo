"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
  isHeaderSolid: boolean;
  isServicesOpen: boolean;
  setIsServicesOpen: (value: boolean) => void;
  serviceMenuItems: string[];
};

export default function DashboardHeader({
  isHeaderSolid,
  isServicesOpen,
  setIsServicesOpen,
  serviceMenuItems,
}: Props) {
  const servicesMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!isServicesOpen) return;
      if (!servicesMenuRef.current?.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isServicesOpen, setIsServicesOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        isHeaderSolid ? "border-b border-black/10 bg-[#f6f5f1]/95 text-[#0e1118] backdrop-blur" : "text-white"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" className="text-[28px] font-semibold leading-none tracking-tight md:text-[40px]">
          BlackDrivo
        </Link>

        <nav className="hidden items-center gap-8 text-[16px] lg:flex">
          <div className="relative" ref={servicesMenuRef}>
            <button
              type="button"
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm leading-none transition-all duration-150 ${
                isServicesOpen
                  ? "border border-white/85 bg-white/10"
                  : "border border-transparent bg-transparent hover:border-white/85 hover:bg-white/10"
              } ${isHeaderSolid ? "text-[#0e1118] hover:border-black/20 hover:bg-black/5" : "text-white"}`}
            >
              <span className="text-[16px] font-medium">Our services</span>
              {isServicesOpen ? (
                <ChevronUp className="h-[18px] w-[18px] translate-y-[0.5px]" />
              ) : (
                <ChevronDown className="h-[18px] w-[18px] translate-y-[0.5px]" />
              )}
            </button>

            {isServicesOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 top-[58px] w-[200px] p-1 overflow-hidden rounded-[18px] border backdrop-blur ${
                  isHeaderSolid
                    ? "border-black/20 bg-white/85 text-black"
                    : "border-white/80 bg-black/30 text-white"
                }`}
              >
                {serviceMenuItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="block w-full rounded-xl px-2 py-2 text-left text-[16px] font-medium hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </div>
          <button type="button">For business</button>
          <button type="button">For chauffeurs</button>
          <button type="button">Help</button>
          <button type="button">English ⌄</button>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className={`hidden rounded-full px-4 py-2 text-sm font-medium md:block ${
              isHeaderSolid
                ? "border border-black/15 bg-white text-black/85"
                : "border border-white/30 bg-white/10 text-white backdrop-blur"
            }`}
          >
            Salman <span className="ml-1">⌄</span>
          </button>
          <Link
            href="/booking"
            className="rounded-full bg-[#0b66d1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0a5ab8] md:px-5 md:py-2.5 md:text-sm"
          >
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}
