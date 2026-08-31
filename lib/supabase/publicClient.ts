import { createClient } from "@supabase/supabase-js";

// Plain anon-key client for reading PUBLIC marketing content (e.g. the Fleet
// Catalog) directly from Supabase in a Server Component. No cookies, no auth
// — just an RLS-gated public SELECT, same project as Admin/PassApp/CapApp.
// Deliberately untyped (not the generated `Database` type) since new public
// content tables like fleet_catalog_vehicles aren't part of the auth-flow
// type generation this site otherwise uses.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
