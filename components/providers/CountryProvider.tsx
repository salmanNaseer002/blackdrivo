"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { detectCountry, fetchActiveCountries, FALLBACK_COUNTRY, type SiteCountry } from "@/lib/booking/country";

interface CountryContextValue {
  country: SiteCountry;
  countries: SiteCountry[];
  setCountry: (c: SiteCountry) => void;
  ready: boolean;
}

const CountryContext = createContext<CountryContextValue>({
  country: FALLBACK_COUNTRY,
  countries: [FALLBACK_COUNTRY],
  setCountry: () => {},
  ready: false,
});

const STORAGE_KEY = "bd_country";

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<SiteCountry>(FALLBACK_COUNTRY);
  const [countries, setCountries] = useState<SiteCountry[]>([FALLBACK_COUNTRY]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const active = await fetchActiveCountries();
      setCountries(active);

      const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored) {
        const match = active.find((c) => c.code === stored);
        if (match) {
          setCountryState(match);
          setReady(true);
          return;
        }
      }

      const detected = await detectCountry(active);
      setCountryState(detected);
      setReady(true);
    };
    init();
  }, []);

  const setCountry = (c: SiteCountry) => {
    setCountryState(c);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, c.code);
  };

  return (
    <CountryContext.Provider value={{ country, countries, setCountry, ready }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useSiteCountry() {
  return useContext(CountryContext);
}
