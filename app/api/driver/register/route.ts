import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { driverRegisterSchema } from "@/validations/driverRegister";

// POST — create auth user + driver record atomically
export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Validate required fields
  const parsed = driverRegisterSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first.message }, { status: 400 });
  }

  const {
    email, password, fullName, phone,
    licenseNum, licenseExpiry, licenseState,
    vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehicleReg, vehicleClass,
  } = parsed.data;

  const supabase = createAdminClient();

  // 1. Create auth user (email auto-confirmed for immediate login)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone, role: "driver" },
  });

  if (authError) {
    const msg = authError.message.toLowerCase().includes("already registered")
      ? "An account with this email already exists. Please log in instead."
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // 2. Insert driver record (status=pending — awaits admin approval)
  // Drivers are self-contained — no public.users row is created.
  const { error: driverError } = await supabase.from("drivers").insert({
    user_id: userId,
    license_number: licenseNum,
    license_expiry: licenseExpiry,
    license_state: licenseState,
    vehicle_make: vehicleMake,
    vehicle_model: vehicleModel,
    vehicle_year: parseInt(vehicleYear, 10),
    vehicle_color: vehicleColor,
    vehicle_registration: vehicleReg,
    vehicle_class: vehicleClass,
    status: "pending",
    is_available: false,
    total_rides: 0,
  } as never);

  if (driverError) {
    // Rollback: delete auth user (cascades to drivers via FK)
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: driverError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId });
}

// PATCH — update driver record with uploaded document URLs
export async function PATCH(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { userId, ...docUrls } = body;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const allowedKeys = ["license_doc_url", "insurance_doc_url", "vehicle_reg_doc_url", "vehicle_photo_url"];
  const safeUrls = Object.fromEntries(
    Object.entries(docUrls).filter(([k]) => allowedKeys.includes(k))
  );

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("drivers")
    .update(safeUrls as never)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
