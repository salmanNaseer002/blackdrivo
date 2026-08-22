import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/account/delete
// Deletes the caller's own account — passenger profile, saved cards, and the
// auth.users row itself (requires the service-role admin client; a client
// session can never delete auth.users directly). Identity comes from the
// requester's own session cookie, never from a client-supplied id, so this
// can only ever delete the caller's own account.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Exit-reason feedback — captured before the passenger row is gone, so
  // there's nothing left to join it back to; standalone by design.
  let reason: string | undefined;
  try {
    const body = await request.json();
    reason = body?.reason;
  } catch {}
  if (reason) {
    await (admin as any).from("account_deletion_feedback").insert({ passenger_email: user.email, reason });
  }

  await admin.from("cards").delete().eq("passenger_id", user.id);
  await admin.from("passengers").delete().eq("id", user.id);
  await admin.from("users").delete().eq("id", user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
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
