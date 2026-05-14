"use client";

import { Users, Briefcase, CheckCircle } from "lucide-react";
import { VEHICLE_CLASSES } from "@/lib/fare";
import type { VehicleClass } from "@/lib/supabase/types";

interface Props {
  selected: VehicleClass;
  onSelect: (v: VehicleClass) => void;
  faresByClass: Record<VehicleClass, number>;
}

export default function VehicleSelector({ selected, onSelect, faresByClass }: Props) {
  return (
    <div className="space-y-3">
      {VEHICLE_CLASSES.map((vehicle) => {
        const isSelected = selected === vehicle.id;
        return (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => onSelect(vehicle.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              isSelected
                ? "border-[#0b66d1] bg-blue-50 ring-1 ring-[#0b66d1]/30"
                : "border-gray-200 bg-white hover:border-[#0b66d1]/40 hover:bg-blue-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{vehicle.name}</p>
                  {isSelected && (
                    <CheckCircle className="h-4 w-4 shrink-0 text-[#0b66d1]" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{vehicle.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {vehicle.seats}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {vehicle.bags}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{vehicle.examples}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={`text-lg font-bold ${isSelected ? "text-[#0b66d1]" : "text-gray-900"}`}>
                  ${faresByClass[vehicle.id]}
                </p>
                <p className="text-xs text-gray-400">est. fare</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
