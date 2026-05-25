import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let body: { email: string; password: string };
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }

  const { email, password } = body;

  if (!email || !/\S+@\S+\.\S+/.test(email))
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  if (!password || password.length < 8)
    return NextResponse.json({ error: "Password min 8 characters" }, { status: 400 });

  const supabase = createAdminClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email:         email.trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { role: "driver" },
  });

  if (authError) {
    const msg = authError.message.toLowerCase().includes("already registered")
      ? "An account with this email already exists."
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // Create minimal driver record
  const { error: driverError } = await supabase.from("drivers").insert({
    user_id:      userId,
    email:        email.trim().toLowerCase(),
    status:       "pending",
    is_available: false,
    total_rides:  0,
    // Required fields with placeholder values
    license_number:       "PENDING",
    license_expiry:       "2030-01-01",
    license_state:        "NY",
    vehicle_make:         "PENDING",
    vehicle_model:        "PENDING",
    vehicle_year:         2020,
    vehicle_color:        "PENDING",
    vehicle_registration: "PENDING",
    vehicle_class:        "business",
  } as never);

  if (driverError) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: driverError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId });
}
