import { createClient } from "@/lib/supabase/client";
import { formatMoney } from "@/lib/booking/money";

export interface PromoResult {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  discountAmount: number;
}

export async function applyPromoCode(
  code: string,
  fare: number,
  categoryId: string,
  symbol = "$",
  currencyCode?: string
): Promise<{ result: PromoResult | null; error: string | null }> {
  const supabase = createClient();
  const { data } = await (supabase as any)
    .from("promo_codes")
    .select("*")
    .ilike("code", code.trim())
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return { result: null, error: "Invalid or expired promo code" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { result: null, error: "This promo code has expired" };
  if (data.max_uses && data.used_count >= data.max_uses) return { result: null, error: "This promo code has reached its usage limit" };
  if (data.min_fare && fare < data.min_fare) return { result: null, error: `Minimum fare of ${formatMoney(data.min_fare, symbol, currencyCode)} required for this code` };
  if (data.category_ids && data.category_ids.length > 0 && !data.category_ids.includes(categoryId)) {
    return { result: null, error: "This promo code isn't valid for the selected vehicle" };
  }

  const discountAmount =
    data.discount_type === "percent" ? Math.round(fare * (data.discount_value / 100) * 100) / 100 : data.discount_value;

  return {
    result: {
      code: data.code,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      discountAmount: Math.min(discountAmount, fare),
    },
    error: null,
  };
}
