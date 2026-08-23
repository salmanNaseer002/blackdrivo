"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { useQueryForm } from "@/hooks/useQueryForm";
import { SUBJECTS_BY_ACCOUNT_TYPE, type AccountType } from "@/validations/query";
import PhoneField from "@/components/contact/PhoneField";
import { DEFAULT_COUNTRIES } from "@/lib/data/locations";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

const errorClass = "mt-1 text-xs text-red-500";

export default function BusinessInquiryForm({
  accountType,
  heading = "Let's talk about your business.",
  intro = "Fill out the form and our business team will get back to you shortly.",
}: {
  accountType: AccountType;
  heading?: string;
  intro?: string;
}) {
  const { form, submitted, resetForm, onSubmit, isSubmitting } = useQueryForm(accountType);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const subjects = SUBJECTS_BY_ACCOUNT_TYPE[accountType];
  const watchedPhone = watch("phone");
  const watchedPhoneCountry = watch("phone_country");
  const selectedCountry =
    DEFAULT_COUNTRIES.find((c) => c.code === watchedPhoneCountry) ?? DEFAULT_COUNTRIES[0];

  return (
    <section id="business-form" className="relative z-10 flex min-h-screen w-full items-center bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-2xl">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 md:text-base">{intro}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm md:p-9"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <CheckCircle className="h-7 w-7 text-[#0b66d1]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Message sent!</h3>
              <p className="mt-2 text-sm text-gray-600">
                We&apos;ll get back to you shortly at the email you provided.
              </p>
              <button
                onClick={resetForm}
                className="mt-6 rounded-full border-2 border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                  placeholder="Tell us about your business needs..."
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
          )}
        </motion.div>
      </div>
    </section>
  );
}
