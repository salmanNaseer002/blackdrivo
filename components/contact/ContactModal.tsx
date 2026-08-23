"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, Loader2, Mail } from "lucide-react";
import { useQueryForm } from "@/hooks/useQueryForm";
import { ACCOUNT_TYPES, SUBJECTS_BY_ACCOUNT_TYPE, type AccountType } from "@/validations/query";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";
import PhoneField from "./PhoneField";

export interface ContactTeam {
  id: AccountType;
  title: string;
  email: string;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

const errorClass = "mt-1 text-xs text-red-500";

export default function ContactModal({ team, onClose }: { team: ContactTeam | null; onClose: () => void }) {
  const { form, submitted, resetForm, onSubmit, isSubmitting } = useQueryForm(team?.id ?? "passenger");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedAccountType = watch("account_type") as AccountType;
  const watchedPhone = watch("phone");
  const watchedPhoneCountry = watch("phone_country");
  const selectedCountry =
    DEFAULT_COUNTRIES.find((c) => c.code === watchedPhoneCountry) ?? DEFAULT_COUNTRIES[0];

  // Re-scope the form (account type, subject options) whenever a different team card is opened.
  useEffect(() => {
    if (team) {
      reset({
        full_name: "",
        email: "",
        phone: "",
        phone_country: "US",
        account_type: team.id,
        subject: "",
        message: "",
      });
    }
  }, [team, reset]);

  // Lock page scroll while the modal is open.
  useEffect(() => {
    if (team) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [team]);

  const subjects = SUBJECTS_BY_ACCOUNT_TYPE[watchedAccountType ?? "passenger"] ?? SUBJECTS_BY_ACCOUNT_TYPE.passenger;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {team && (
        // Full-screen — intentionally has no outside-click handler, only the X button closes it.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-white"
        >
          {/* Favicon watermarks — scattered at random angles, some upside down */}
          <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden opacity-[0.05]">
            <Image src="/icon.png" alt="" width={280} height={280} aria-hidden
              className="absolute -left-10 -top-10 w-48 rotate-[-18deg]" />
            <Image src="/icon.png" alt="" width={280} height={280} aria-hidden
              className="absolute -right-16 top-1/4 w-56 rotate-[164deg]" />
            <Image src="/icon.png" alt="" width={280} height={280} aria-hidden
              className="absolute left-1/3 top-1/2 w-40 rotate-[73deg]" />
            <Image src="/icon.png" alt="" width={280} height={280} aria-hidden
              className="absolute -bottom-14 -left-8 w-52 rotate-[142deg]" />
            <Image src="/icon.png" alt="" width={280} height={280} aria-hidden
              className="absolute -bottom-10 right-8 w-44 rotate-[-96deg]" />
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="fixed right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 md:right-8 md:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative z-[1] mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-20">
            {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <CheckCircle className="h-7 w-7 text-[#0b66d1]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Message sent!</h3>
                  <p className="mt-2 max-w-xs text-sm text-gray-600">
                    We&apos;ll get back to you shortly at the email you provided.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 rounded-full border-2 border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{team.title}</h2>
                  <a
                    href={`mailto:${team.email}`}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-[#0b66d1] hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" /> {team.email}
                  </a>
                  <p className="mt-3 text-sm text-gray-500">
                    Fill out the form below and our team will get back to you.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("full_name")}
                          placeholder="John Smith"
                          className={inputClass}
                          aria-invalid={!!errors.full_name}
                        />
                        {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="john@example.com"
                          className={inputClass}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                      </div>
                    </div>

                    <PhoneField
                      country={selectedCountry}
                      onCountryChange={(c) => setValue("phone_country", c.code)}
                      value={watchedPhone ?? ""}
                      onChange={(v) => setValue("phone", v, { shouldValidate: true })}
                      error={errors.phone?.message}
                    />

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Account Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("account_type")}
                        className={inputClass}
                        aria-invalid={!!errors.account_type}
                      >
                        {ACCOUNT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {errors.account_type && <p className={errorClass}>{errors.account_type.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("subject")}
                        className={inputClass}
                        aria-invalid={!!errors.subject}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder="How can we help you?"
                        className={`${inputClass} resize-none`}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          Send message <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
