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

  const protectedPaths = [
    "/user/dashboard", "/user/profile", "/user/payments",
    "/driver/dashboard",
    "/admin",
  ];

  const driverAuthPaths = ["/driver/login", "/driver/signup"];
  const passengerAuthPaths = ["/login", "/signup"];

  // Login required — protected routes
  if (!user && protectedPaths.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith("/driver") ? "/driver/login" : "/login";
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
  if (user && passengerAuthPaths.some(p => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    const role = user.user_metadata?.role;
    url.pathname = role === "driver" ? "/driver/overview" : role === "admin" ? "/admin" : "/user/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};