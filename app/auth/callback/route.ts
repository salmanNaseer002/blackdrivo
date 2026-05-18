import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/user/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      const { user } = data.session;
      const role = user.user_metadata?.role as string | undefined;

      // Drivers are self-contained in public.drivers — no public.users row needed.
      // For users/admins, ensure the public.users record exists in case the trigger missed it.
      if (role !== "driver") {
        await supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name ?? null,
            phone: user.user_metadata?.phone ?? null,
            role: role ?? "user",
          } as never,
          { onConflict: "id" }
        );
      }
      const dest =
        role === "driver" ? "/driver/dashboard" :
        role === "admin"  ? "/admin" :
        next;
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", request.url));
}
