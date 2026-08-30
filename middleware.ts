import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
  const pathname = request.nextUrl.pathname;

  // Region redirect — first-time visitors from Pakistan land on /pk instead
  // of the default (US) homepage. Only the exact homepage is redirected (not
  // every route) so deep links, bookmarks, and in-app navigation are never
  // hijacked, and a cookie remembers the visit so someone who deliberately
  // navigates back to "/" from "/pk" isn't bounced back every time.
  if (pathname === "/" && !request.cookies.get("bd_region_seen")) {
    const geoCountry = request.headers.get("x-vercel-ip-country");
    if (geoCountry === "PK") {
      const redirectResponse = NextResponse.redirect(new URL("/pk", request.url));
      redirectResponse.cookies.set("bd_region_seen", "1", { maxAge: 60 * 60 * 24 * 30, path: "/" });
      return redirectResponse;
    }
    supabaseResponse.cookies.set("bd_region_seen", "1", { maxAge: 60 * 60 * 24 * 30, path: "/" });
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