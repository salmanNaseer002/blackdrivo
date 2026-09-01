"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdSlot from "./AdSlot";

// Site-wide closable ad popup, mounted once in app/layout.tsx so it can
// appear on every page. Shows once per browser session (sessionStorage) —
// not on every single page navigation, which would be both extremely
// intrusive for users and against Google's own Better Ads Standards for
// interstitial/popup ads. Once a real AdSense Publisher ID exists, swap the
// <AdSlot> placeholder below for the real ad unit; the popup shell itself
// doesn't need to change.
const SESSION_KEY = "bd_ad_popup_shown";

export default function AdPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem(SESSION_KEY, "1");
      }, 1500);
      return () => clearTimeout(timer);
    } catch {
      // sessionStorage unavailable (e.g. private browsing) — just skip the popup
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close advertisement"
        >
          <X className="h-4 w-4" />
        </button>
        <AdSlot label="Advertisement" className="min-h-[220px]" />
      </div>
    </div>
  );
}
