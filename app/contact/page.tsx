"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight, CheckCircle, Loader2,
} from "lucide-react";
import { useQueryForm } from "@/hooks/useQueryForm";
import { QUERY_SUBJECTS } from "@/validations/query";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    detail: "+1 (800) 555-0199",
    sub: "Available 24/7",
    href: "tel:+18005550199",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "support@blackdrivo.com",
    sub: "Response within 2 hours",
    href: "mailto:support@blackdrivo.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "+1 (800) 555-0199",
    sub: "Quick replies during business hours",
    href: "https://wa.me/+923454449433",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    detail: "NY 10001",
    sub: "Serving NJ & surrounding areas",
    href: "#",
  },
];

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 2 hours in advance for standard rides. For airport transfers and events, 24 hours in advance is ideal.",
  },
  {
    q: "What if my flight is delayed?",
    a: "We track all flights in real-time. If your flight is delayed, your driver will automatically adjust the pickup time at no extra charge.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes. Cancellations made more than 24 hours before. Late cancellations may incur a fee.",
  },
  {
    q: "Do you offer corporate accounts?",
    a: "Yes! We offer centralized billing and team accounts for businesses. Contact our sales team for details.",
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20";

const errorClass = "mt-1 text-xs text-red-500";

export default function ContactPage() {
  const { form, submitted, resetForm, onSubmit, isSubmitting } = useQueryForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white px-4 pb-12 pt-32 text-center md:pt-40">
        <div className="relative">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            Get in touch
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            We&apos;re here to help
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Have a question, need a custom quote, or want to set up a corporate account?
            Our team is available 24/7 to assist you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#0b66d1]/25 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0b66d1]">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {item.title}
              </p>
              <p className="mt-1.5 font-semibold text-gray-900">{item.detail}</p>
              <p className="text-xs text-gray-500">{item.sub}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Contact form + FAQ */}
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto grid w-full gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Form card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm md:p-9">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <CheckCircle className="h-7 w-7 text-[#0b66d1]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Message sent!</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We&apos;ll get back to you within 2 hours. Check your inbox for a
                  confirmation.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-6 rounded-full border-2 border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#0b66d1] hover:text-[#0b66d1]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                <p className="mt-1.5 text-sm text-gray-500">
                  Fill out the form and we&apos;ll respond within 2 hours.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
                  {/* Name + Phone row */}
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
                      {errors.full_name && (
                        <p className={errorClass}>{errors.full_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={inputClass}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <p className={errorClass}>{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
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
                    {errors.email && (
                      <p className={errorClass}>{errors.email.message}</p>
                    )}
                  </div>

                  {/* Subject */}
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
                      {QUERY_SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && (
                      <p className={errorClass}>{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
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
                    {errors.message && (
                      <p className={errorClass}>{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
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

          {/* FAQ + Hours sidebar */}
          <div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-7">
              <h3 className="text-lg font-bold text-gray-900">Frequently asked questions</h3>
              <div className="mt-5 space-y-5">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-semibold text-gray-900">{faq.q}</p>
                    <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <Clock className="mb-3 h-5 w-5 text-[#0b66d1]" />
              <h4 className="font-semibold text-gray-900">Business Hours</h4>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {[
                  ["Phone & Chat Support", "24/7"],
                  ["Email Support", "24 hours"],
                  ["Dispatch Operations", "24/7"],
                ].map(([label, hours]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span className="font-medium text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
