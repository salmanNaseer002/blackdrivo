"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";

interface Suggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: { description: string; lat: number; lng: number }) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gmaps = (): any => (typeof window !== "undefined" ? (window as any).google?.maps : undefined);

export default function LocationAutocomplete({ value, onChange, onSelect, placeholder, icon }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = (input: string) => {
    const maps = gmaps();
    if (!input || input.length < 3 || !maps?.places) {
      setSuggestions([]);
      return;
    }

    const service = new maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input, componentRestrictions: { country: "us" }, types: ["geocode", "establishment"] },
      (predictions: Array<{ place_id: string; description: string; structured_formatting: { main_text: string; secondary_text?: string } }> | null, status: string) => {
        if (status === "OK" && predictions) {
          setSuggestions(
            predictions.slice(0, 5).map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text ?? "",
            }))
          );
          setIsOpen(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setIsOpen(false);
    setSuggestions([]);

    const maps = gmaps();
    if (!maps) {
      onSelect({ description: suggestion.description, lat: 0, lng: 0 });
      return;
    }

    const geocoder = new maps.Geocoder();
    geocoder.geocode(
      { placeId: suggestion.placeId },
      (results: Array<{ geometry: { location: { lat: () => number; lng: () => number } } }> | null, status: string) => {
        if (status === "OK" && results?.[0]) {
          const loc = results[0].geometry.location;
          onSelect({ description: suggestion.description, lat: loc.lat(), lng: loc.lng() });
        } else {
          onSelect({ description: suggestion.description, lat: 0, lng: 0 });
        }
      }
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0b66d1]">
          {icon ?? <MapPin className="h-4 w-4" />}
        </span>
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 300);
          }}
          placeholder={placeholder ?? "Enter location"}
          className="w-full rounded-xl border border-white/12 bg-white/5 py-3.5 pl-10 pr-10 text-sm text-white placeholder-white/40 outline-none ring-[#0b66d1] transition focus:border-[#0b66d1]/50 focus:ring-2"
        />
        {value && (
          <button
            onClick={() => { onChange(""); setSuggestions([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-white/12 bg-[#0f1723] shadow-2xl">
          {suggestions.map((s) => (
            <button
              key={s.placeId}
              onClick={() => handleSelect(s)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0b66d1]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{s.mainText}</p>
                <p className="truncate text-xs text-white/45">{s.secondaryText}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
