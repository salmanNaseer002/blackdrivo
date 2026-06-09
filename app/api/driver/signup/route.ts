import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let body: {
    email: string; password: string;
    fullName: string; dob: string; phone: string; countryCode: string;
    licenseNumber: string; licenseState: string | null; licenseExpiry: string;
  consent: boolean; cityText?: string | null;
  };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

const { email, password, fullName, dob, phone, countryCode, cityText, licenseNumber, licenseState, licenseExpiry, consent } = body;

  if (!email || !/\S+@\S+\.\S+/.test(email))
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  if (!password || password.length < 8)
    return NextResponse.json({ error: "Password min 8 characters" }, { status: 400 });
  if (!fullName?.trim())
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  if (!dob)
    return NextResponse.json({ error: "Date of birth is required" }, { status: 400 });
  if (!licenseNumber?.trim())
    return NextResponse.json({ error: "License number is required" }, { status: 400 });
  if (!licenseExpiry)
    return NextResponse.json({ error: "License expiry is required" }, { status: 400 });

  const supabase = createAdminClient();

  // Create auth user — user_type: 'driver' in metadata
  // Pehle check karo — auth user already exist karta hai?
 const { data: { users: foundUsers } } = await supabase.auth.admin.listUsers({ 
    page: 1, perPage: 1000 
  });
  const alreadyExists = foundUsers?.find(
    u => u.email?.toLowerCase() === email.trim().toLowerCase()
  ) ?? null;

// Agar exist karta hai toh sirf password update karo aur drivers record check karo
if (alreadyExists) {
  // Check karo drivers table mein hai ya nahi
  const { data: existingDriver } = await supabase
    .from("drivers")
    .select("id")
    .eq("user_id", alreadyExists.id)
    .maybeSingle() as any;

  if (existingDriver) {
    // Driver already complete hai
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
  }

  // Auth user hai lekin driver record nahi — update karo aur proceed karo
  await supabase.auth.admin.updateUserById(alreadyExists.id, {
    password,
    email_confirm: true,
    user_metadata: {
      role: "driver",
      user_type: "driver",
      full_name: fullName.trim(),
      phone: phone?.trim() || null,
      country_code: countryCode || "US",
    },
  });

  // Driver record banao
  const { error: driverError } = await supabase.from("drivers").insert({
    user_id:                     alreadyExists.id,
    email:                       email.trim().toLowerCase(),
    full_name:                   fullName.trim(),
    dob,
    phone:                       phone?.trim() || null,
    country_code:                countryCode || "US",
    city_text:                   (body as any).cityText || null,
    license_number:              licenseNumber.trim(),
    license_state:               licenseState || null,
    license_expiry:              licenseExpiry,
    background_check_consent:    consent || false,
    background_check_consent_at: consent ? new Date().toISOString() : null,
    status:                      "pending",
    is_available:                false,
    total_rides:                 0,
    vehicle_make:                "PENDING",
    vehicle_model:               "PENDING",
    vehicle_year:                2020,
    vehicle_color:               "PENDING",
    vehicle_registration:        "PENDING",
    vehicle_class:               "business",
  } as never);

  if (driverError) {
    return NextResponse.json({ error: driverError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: alreadyExists.id });
}

const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email:         email.trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: {
      role:      "driver",
      user_type: "driver",           // ← trigger picks this up
      full_name: fullName.trim(),
      phone:     phone?.trim() || null,
      country_code: countryCode || "US",
    },
  });

  if (authError) {
    const msg = authError.message.toLowerCase().includes("already registered")
      ? "An account with this email already exists."
      : authError.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const userId = authData.user.id;

  // Create driver record
  const { error: driverError } = await supabase.from("drivers").insert({
    user_id:                     userId,
    email:                       email.trim().toLowerCase(),
    full_name:                   fullName.trim(),
    dob:                         dob,
    phone:                       phone?.trim() || null,
    city_text:                   cityText || null,
    country_code:                countryCode || "US",
    license_number:              licenseNumber.trim(),
    license_state:               licenseState || null,
    license_expiry:              licenseExpiry,
    background_check_consent:    consent || false,
    background_check_consent_at: consent ? new Date().toISOString() : null,
    status:                      "pending",
    is_available:                false,
    total_rides:                 0,
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

  // Also update users table user_type to driver (in case trigger already ran)
  return NextResponse.json({ success: true, userId });
}
