"use client";

import { useRef } from "react";

// 6 separate digit boxes ("_ _ _ _ _ _"), shared by every OTP-verify step
// (login's Email OTP, Account's email-change verify) instead of one plain
// text field — auto-advances focus on digit entry, backspace steps back,
// and pasting a full code fills every box at once.
export default function OtpInput({
  value, onChange, length = 6, disabled = false, autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const setDigit = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join(""));
  };

  const handleChange = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "");
    if (!d) { setDigit(i, ""); return; }
    // Typing (or pasting into one box) can land more than one digit at once
    const chars = d.split("");
    const next = digits.slice();
    let idx = i;
    for (const c of chars) {
      if (idx >= length) break;
      next[idx] = c;
      idx++;
    }
    onChange(next.join(""));
    const focusIdx = Math.min(idx, length - 1);
    refs.current[focusIdx]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    const focusIdx = Math.min(text.length, length - 1);
    refs.current[focusIdx]?.focus();
  };

  return (
    // Each box is `flex-1 min-w-0` (not `w-full`) — six full-width siblings in
    // a flex row fought each other for 100% width and overflowed the page on
    // mobile, forcing a horizontal scroll to see the rest of the screen.
    <div className="flex gap-1.5 sm:gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          inputMode="numeric"
          maxLength={1}
          className="h-12 min-w-0 flex-1 rounded-xl border border-gray-200 text-center text-lg font-semibold text-gray-900 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 disabled:bg-gray-50"
        />
      ))}
    </div>
  );
}
