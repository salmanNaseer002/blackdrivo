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
            onClick={() => onSelect(vehicle.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              isSelected
                ? "border-[#0b66d1] bg-[#0b66d1]/10"
                : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{vehicle.name}</p>
                  {isSelected && <CheckCircle className="h-4 w-4 text-[#0b66d1]" />}
                </div>
                <p className="mt-0.5 text-xs text-white/45">{vehicle.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {vehicle.seats}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {vehicle.bags}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/30">{vehicle.examples}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  ${faresByClass[vehicle.id]}
                </p>
                <p className="text-xs text-white/40">est. fare</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
