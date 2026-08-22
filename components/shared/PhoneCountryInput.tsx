"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { formatPhone } from "@/lib/booking/phone";
import type { SiteCountry } from "@/lib/booking/country";

// Country-code + phone input, shared between Signup and Account > Edit info —
// same "flag + dial code dropdown, changeable independently of the site's
// booking region" pattern.
export default function PhoneCountryInput({
  countries, phoneCountry, setPhoneCountry, phone, setPhone,
}: {
  countries: SiteCountry[];
  phoneCountry: SiteCountry;
  setPhoneCountry: (c: SiteCountry) => void;
  phone: string;
  setPhone: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex shrink-0 items-center gap-1 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 transition hover:bg-gray-100"
      >
        <span>{phoneCountry.flag}</span>
        <span>{phoneCountry.phone_code}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <input
        type="tel" value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value, phoneCountry.code))}
        placeholder="Phone number"
        className="min-w-0 flex-1 rounded-r-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-2 max-h-64 w-56 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl"
          >
            {countries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => { setPhoneCountry(c); setPhone(""); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${
                  c.code === phoneCountry.code ? "font-semibold text-[#0b66d1]" : "text-gray-700"
                }`}
              >
                <span>{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                <span className="text-xs text-gray-400">{c.phone_code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
