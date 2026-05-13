"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Car, Calendar, MapPin, Download, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function ConfirmationContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? "BK" + Date.now();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-white border border-gray-100 shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50"
          >
            <CheckCircle className="h-8 w-8 text-[#0b66d1]" />
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your chauffeur has been assigned and will be there on time.
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4 text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Booking Reference
            </p>
            <p className="font-mono text-lg font-bold text-[#0b66d1]">{bookingId.toUpperCase()}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { icon: Car, label: "Vehicle", value: "Business Class" },
              { icon: Calendar, label: "Scheduled", value: "Confirmed" },
              { icon: MapPin, label: "Tracking", value: "Live GPS" },
              { icon: CheckCircle, label: "Status", value: "Confirmed" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-left">
                <item.icon className="mb-1.5 h-4 w-4 text-[#0b66d1]" />
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-medium text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-gray-400">
            A confirmation email with your full booking details has been sent to your email address.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/user/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white transition hover:bg-[#0952a8]"
            >
              View my bookings <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900">
              <Download className="h-4 w-4" /> Download receipt
            </button>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
