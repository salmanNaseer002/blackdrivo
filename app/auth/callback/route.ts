import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect back from Supabase after OAuth (Google) sign-in:
// exchanges the ?code for a session, then makes sure a `passengers` row
// exists for this user — bookings.passenger_id foreign-keys to `passengers`,
// not `auth.users`, so a Google sign-in with no prior signup would otherwise
// leave the passenger profile (name/phone) empty, same issue this whole
// auth flow was rebuilt to avoid.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/booking/review";

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      const { data: existing } = await (supabase as any)
        .from("passengers").select("id").eq("id", data.user.id).maybeSingle();
      if (!existing) {
        const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Passenger";
        await (supabase as any).from("passengers").upsert({
          id: data.user.id,
          name,
          email: data.user.email,
          status: "active",
          source: "website_google",
        }, { onConflict: "id" });
      }
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
