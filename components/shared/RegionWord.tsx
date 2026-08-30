"use client";

import { usePathname } from "next/navigation";

/**
 * Small client-only helper for region-aware inline word swaps on pages that
 * are otherwise Server Components (e.g. ones exporting `metadata` or an
 * async default export using `params`). Renders `pk` under any /pk/* route
 * (served via the middleware rewrite) and `us` everywhere else.
 */
export default function RegionWord({ us, pk }: { us: string; pk: string }) {
  const pathname = usePathname();
  const isPk = pathname === "/pk" || pathname.startsWith("/pk/");
  return <>{isPk ? pk : us}</>;
}
