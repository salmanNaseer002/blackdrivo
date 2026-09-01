"use client";

// Reusable ad placement — structurally ready for Google AdSense, but
// deliberately rendering a clearly-labeled placeholder for now: this site
// has no AdSense Publisher ID yet, so injecting a real adsbygoogle.js
// snippet with a fake client ID would either error out or render nothing
// useful. Once a Publisher ID + ad unit slot ID exist, replace the
// placeholder <div> below with the real <ins class="adsbygoogle"> snippet
// (and load the adsbygoogle.js loader script once, in the pages that use
// ad slots) — the sizes/placements chosen here won't need to change, since
// they're already standard IAB/AdSense unit sizes.
const SIZES = {
  // name: [width, height] in px, exactly matching Google-recommended ad sizes
  leaderboard:       [728, 90],
  banner:            [468, 60],
  "mobile-banner":   [320, 50],
  "medium-rectangle":[300, 250],
  "large-rectangle": [336, 280],
  skyscraper:        [160, 600],
  "half-page":       [300, 600],
  square:            [250, 250],
} as const;

type AdSize = keyof typeof SIZES;

export default function AdSlot({
  label = "Advertisement",
  size = "medium-rectangle",
  responsive = false,
  className = "",
}: {
  label?: string;
  size?: AdSize;
  /** Fluid width instead of a fixed IAB box — used for slots that must fill a flexible container (e.g. full-width banners between content blocks). */
  responsive?: boolean;
  className?: string;
}) {
  const [w, h] = SIZES[size];

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 ${responsive ? "w-full" : "mx-auto"} ${className}`}
      style={responsive ? { minHeight: h } : { width: w, height: h, maxWidth: "100%" }}
      aria-label={label}
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label} · {w}×{h}
      </span>
    </div>
  );
}
