"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { DEFAULT_COUNTRIES, type Country } from "@/lib/data/locations";

export function formatPhoneForCountry(raw: string, country: Country) {
  const digits = raw.replace(/\D/g, "");
  const needed = (country.phoneFormat.match(/#/g) ?? []).length;
  const capped = digits.slice(0, needed);
  let result = "";
  let di = 0;
  for (const ch of country.phoneFormat) {
    if (di >= capped.length) break;
    if (ch === "#") {
      result += capped[di];
      di++;
    } else {
      result += ch;
    }
  }
  return result;
}

export default function PhoneField({
  country,
  onCountryChange,
  value,
  onChange,
  error,
}: {
  country: Country;
  onCountryChange: (c: Country) => void;
  value: string;
  onChange: (v: string) => void;
  error?: string;
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
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone</label>
      <div className="flex gap-2">
        <div className="relative shrink-0" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-full items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-3.5 text-sm text-gray-700 transition hover:border-gray-300"
          >
            <span>{country.flag}</span>
            <span className="font-medium">{country.phoneCode}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute left-0 top-full z-20 mt-1.5 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
              {DEFAULT_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onCountryChange(c);
                    onChange("");
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition hover:bg-blue-50 hover:text-[#0b66d1] ${
                    c.code === country.code ? "font-semibold text-[#0b66d1]" : "text-gray-700"
                  }`}
                >
                  <span>{c.flag}</span>
                  {c.name}
                  <span className="ml-auto text-xs text-gray-400">{c.phoneCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(formatPhoneForCountry(e.target.value, country))}
          placeholder={country.phonePlaceholder}
          aria-invalid={!!error}
          className="w-full flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20"
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-gray-400">Format: {country.phoneCode} {country.phoneFormat}</p>
      )}
    </div>
  );
}
