import type { VehicleClass, RideType } from "./supabase/types";

const BASE_RATES: Record<VehicleClass, { perMile: number; base: number; perHour: number }> = {
  business: { base: 15, perMile: 3.5, perHour: 75 },
  first_class: { base: 25, perMile: 5.5, perHour: 120 },
  suv: { base: 20, perMile: 4.5, perHour: 95 },
  van: { base: 20, perMile: 4.0, perHour: 90 },
};

export function estimateFare(
  vehicleClass: VehicleClass,
  rideType: RideType,
  distanceMiles?: number,
  hours?: number
): number {
  const rates = BASE_RATES[vehicleClass];
  if (rideType === "hourly" && hours) {
    return Math.round(rates.base + rates.perHour * hours);
  }
  if (distanceMiles) {
    return Math.round(rates.base + rates.perMile * distanceMiles);
  }
  return rates.base;
}

export const VEHICLE_CLASSES: Array<{
  id: VehicleClass;
  name: string;
  description: string;
  seats: string;
  bags: string;
  examples: string;
}> = [
  {
    id: "business",
    name: "Business Class",
    description: "Executive sedans for professional travel",
    seats: "Up to 3 passengers",
    bags: "2 bags",
    examples: "Mercedes E-Class, BMW 5 Series",
  },
  {
    id: "first_class",
    name: "First Class",
    description: "Top-tier luxury vehicles for VIP experiences",
    seats: "Up to 3 passengers",
    bags: "2 bags",
    examples: "Mercedes S-Class, BMW 7 Series",
  },
  {
    id: "suv",
    name: "Business SUV",
    description: "Spacious SUVs for groups and families",
    seats: "Up to 6 passengers",
    bags: "5 bags",
    examples: "Cadillac Escalade, Mercedes GLS",
  },
  {
    id: "van",
    name: "Business Van",
    description: "Large vans for airport groups and events",
    seats: "Up to 7 passengers",
    bags: "7 bags",
    examples: "Mercedes Sprinter, Ford Transit",
  },
];
