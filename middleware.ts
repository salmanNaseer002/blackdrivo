import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Marketing/content paths only — these are the pages that get a /pk/<path>
// equivalent AND get auto-redirected there for Pakistan visitors. Anything
// NOT under one of these prefixes (auth, booking checkout, the driver app,
// live tracking, API routes) is left alone entirely: those flows depend on
// cookies/query state/redirects that a region rewrite could easily break,
// and they don't have region-specific copy to show anyway.
const REGION_PREFIXES = [
  "/", "/services", "/chauffeur-service", "/airport-transfer", "/limousine-service",
  "/about", "/contact", "/careers", "/press", "/blog", "/help",
  "/privacy-policy", "/terms-of-service", "/accessibility", "/hipaa-compliance",
  "/business", "/corporate", "/partner", "/offers", "/fleet",
];

function isRegionPath(pathname: string) {
  return REGION_PREFIXES.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // ── /pk/<rest> transparently serves the same page as <rest> ──────────
  // "/pk" itself is its own real route (app/pk/page.tsx, with its own
  // Pakistan-specific metadata) and is NOT rewritten. Every OTHER /pk/...
  // URL is rewritten internally to the un-prefixed path, so every marketing
  // page is reachable under /pk/ without a second copy of the file existing.
  if (pathname !== "/pk" && pathname.startsWith("/pk/")) {
    const target = pathname.slice(3); // strip leading "/pk"
    if (isRegionPath(target)) {
      // Stamp x-region so pages that can't read the URL directly (a plain
      // `export const metadata` / `generateMetadata` has no access to
      // usePathname()) can still tell they're serving a /pk/ visitor and
      // return Pakistan-worded <title>/<meta description> instead of always
      // the US copy baked into the un-prefixed route.
      const headers = new Headers(request.headers);
      headers.set("x-region", "pk");
      return NextResponse.rewrite(new URL(target + request.nextUrl.search, request.url), {
        request: { headers },
      });
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Region redirect — Pakistan visitors land on the /pk/<page> equivalent of
  // whatever marketing page they hit, instead of the default (US) content.
  if (isRegionPath(pathname)) {
    const geoCountry = request.headers.get("x-vercel-ip-country");
    if (geoCountry === "PK") {
      const target = pathname === "/" ? "/pk" : `/pk${pathname}`;
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  const protectedPaths = ["/driver/dashboard"];
  const passengerProtectedPaths = ["/booking/review"];
  const driverAuthPaths = ["/driver/login", "/driver/signup"];
  const passengerAuthPaths = ["/login", "/signup"];

  // Login required — protected routes
  if (!user && protectedPaths.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/driver/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && passengerProtectedPaths.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

   // Driver already logged in — driver auth pages pe mat jaao
  if (user && driverAuthPaths.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/driver/dashboard/overview";
    return NextResponse.redirect(url);
  }

  // Passenger already logged in — passenger auth pages pe mat jaao
  if (user && passengerAuthPaths.some(p => pathname === p)) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get("redirect") || "/booking/review";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
