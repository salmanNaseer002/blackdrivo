import { createClient } from "@/lib/supabase/client";

export interface Addon {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

export async function fetchAddons(categoryId: string, countryCode: string): Promise<Addon[]> {
  const supabase = createClient();
  const { data } = await (supabase as any)
    .from("booking_addons")
    .select("id,name,description,price,category_ids,country_codes")
    .eq("is_active", true);

  return (data || [])
    .filter((a: any) => !a.category_ids || a.category_ids.length === 0 || a.category_ids.includes(categoryId))
    .filter((a: any) => !a.country_codes || a.country_codes.length === 0 || a.country_codes.includes(countryCode))
    .map((a: any) => ({ id: a.id, name: a.name, description: a.description, price: a.price }));
}
