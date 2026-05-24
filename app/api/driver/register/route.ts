import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { driverRegisterSchema } from "@/validations/driverRegister";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }) }

  const parsed = driverRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const {
    email, password, fullName, phone,
    dob, address,
    licenseNum, licenseExpiry, licenseState,
    vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehicleReg, vehicleClass,
  } = parsed.data;

  const country       = (body as any).country       || null;
  const city          = (body as any).city          || null;
  const vehicleVariant = (body as any).vehicleVariant || null;

  const supabase = createAdminClient();

  // Create auth user — email auto-confirmed, role=driver in metadata
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone, role: "driver" },
  });

  if (authError) {
    const msg = authError.message.toLowerCase().includes("already registered")
      ? "An account with this email already exists."
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // Insert driver record
  const { error: driverError } = await supabase.from("drivers").insert({
    user_id:              userId,
    full_name:            fullName,
    email:                email,
    phone:                phone || null,
    license_number:       licenseNum,
    license_expiry:       licenseExpiry,
    license_state:        licenseState,
    vehicle_make:         vehicleMake,
    vehicle_model:        vehicleModel,
    vehicle_year:         parseInt(vehicleYear, 10),
    vehicle_color:        vehicleColor,
    vehicle_registration: vehicleReg,
    vehicle_class:        vehicleClass,
    dob:                  dob || null,
    home_address:         address || null,
    country_code:         country,
    city_code:            city,
    vehicle_variant:      vehicleVariant,
    status:               "pending",
    is_available:         false,
    total_rides:          0,
  } as never);

  if (driverError) {
    await supabase.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: driverError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId });
}

export async function PATCH(req: NextRequest) {
  let body: Record<string, string | string[]>;
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }) }

  const { userId, ...docUrls } = body;
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const allowedKeys = [
    "license_doc_url", "insurance_doc_url",
    "vehicle_reg_doc_url", "vehicle_photo_url",
    "driver_photo_url", "driver_with_license_url",
    "license_front_url", "license_back_url",
    "vehicle_insurance_url",
    "vehicle_exterior_photos", "vehicle_interior_photos",
  ];

  const safeUrls = Object.fromEntries(
    Object.entries(docUrls).filter(([k]) => allowedKeys.includes(k))
  );

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("drivers")
    .update(safeUrls as never)
    .eq("user_id", userId as string);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
