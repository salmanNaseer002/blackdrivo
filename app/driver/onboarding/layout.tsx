"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const STEPS = [
  { id: "personal",  label: "Personal Info",  path: "/driver/onboarding/personal"  },
  { id: "vehicle",   label: "Vehicle",         path: "/driver/onboarding/vehicle"   },
  { id: "documents", label: "Documents",       path: "/driver/onboarding/documents" },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIdx = STEPS.findIndex(s => pathname.startsWith(s.path));
  const progress = ((currentIdx + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b66d1]">
              <Image src="/B Logo Black Theme.png" alt="BlackDrivo" width={18} height={18} className="object-contain invert mix-blend-screen" />
            </div>
            <span className="text-lg font-bold text-gray-900">BlackDrivo</span>
          </Link>
          <div className="text-sm text-gray-500">
            Step {currentIdx + 1} of {STEPS.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-[#0b66d1] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Steps indicator */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 px-4 py-4">
          {STEPS.map((s, i) => {
            const done    = i < currentIdx;
            const current = i === currentIdx;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                  done    ? "bg-[#0b66d1] text-white"
                  : current ? "bg-[#0b66d1] text-white ring-4 ring-[#0b66d1]/20"
                  : "bg-gray-200 text-gray-400"
                }`}>
                  {done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`hidden text-sm font-medium sm:block ${current ? "text-gray-900" : done ? "text-[#0b66d1]" : "text-gray-400"}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className={`ml-2 h-px w-8 ${i < currentIdx ? "bg-[#0b66d1]" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 lg:py-12">
        {children}
      </div>
    </div>
  );
}
