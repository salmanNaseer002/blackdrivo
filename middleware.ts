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

  // Region redirect — every visit to the homepage from Pakistan lands on /pk
  // instead of the default (US) homepage. Only the exact homepage is
  // redirected (not every route) so deep links, bookmarks, and in-app
  // navigation are never hijacked.
  if (pathname === "/") {
    const geoCountry = request.headers.get("x-vercel-ip-country");
    if (geoCountry === "PK") {
      return NextResponse.redirect(new URL("/pk", request.url));
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