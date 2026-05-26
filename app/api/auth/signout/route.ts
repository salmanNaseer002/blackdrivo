import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// POST /api/auth/signout
// Server-side signout — ensures auth cookies are cleared before redirect.
// Client-side signOut() only clears localStorage; this route clears the
// HTTP cookies that the Next.js middleware reads, preventing stale sessions.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}/`, { status: 302 });

  // Belt-and-suspenders: manually expire the Supabase auth cookies in case
  // the server client didn't clear them (e.g. if signOut() errored out)
  const cookieNames = [
    "sb-access-token",
    "sb-refresh-token",
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`,
  ];
  for (const name of cookieNames) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }

  return response;
}
