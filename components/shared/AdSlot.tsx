"use client";

// Reusable ad placement — structurally ready for Google AdSense, but
// deliberately rendering a clearly-labeled placeholder for now: this site
// has no AdSense Publisher ID yet, so injecting a real adsbygoogle.js
// snippet with a fake client ID would either error out or render nothing
// useful. Once a Publisher ID + ad unit slot ID exist, replace the
// placeholder <div> below with the real <ins class="adsbygoogle"> snippet
// (and load the adsbygoogle.js loader script once, site-wide, in
// app/layout.tsx) — the surrounding placement/spacing here won't need to
// change.
export default function AdSlot({
  label = "Advertisement",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 py-6 text-center ${className}`}
      aria-label={label}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );
}
