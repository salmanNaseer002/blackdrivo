"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight, CheckCircle } from "lucide-react";

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
    href: "https://wa.me/18005550199",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    detail: "New York, NY 10001",
    sub: "Serving NY, NJ & surrounding areas",
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
    a: "Yes. Cancellations made more than 24 hours before the scheduled pickup are free of charge. Late cancellations may incur a fee.",
  },
  {
    q: "Do you offer corporate accounts?",
    a: "Yes! We offer centralized billing and team accounts for businesses. Contact our sales team for details.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

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
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <motion.a
              key={item.title}
              href={item.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group rounded-2xl bg-white border border-gray-100 shadow-sm p-5 transition hover:shadow-md hover:border-[#0b66d1]/25"
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
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Form */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-7 md:p-9">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <CheckCircle className="h-7 w-7 text-[#0b66d1]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Message sent!</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We&apos;ll get back to you within 2 hours. Check your inbox for a confirmation.
                </p>
                <button
                  onClick={() => { setSent(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }}
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
                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Full Name *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking inquiry</option>
                      <option value="corporate">Corporate accounts</option>
                      <option value="driver">Driver partnership</option>
                      <option value="support">Customer support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-700">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none ring-[#0b66d1] focus:border-[#0b66d1] focus:ring-2 focus:ring-[#0b66d1]/20 transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0952a8] disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>Send message <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* FAQ */}
          <div>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-7">
              <h3 className="text-lg font-bold text-gray-900">Frequently asked questions</h3>
              <div className="mt-5 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-gray-900">{faq.q}</p>
                    <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <Clock className="mb-3 h-5 w-5 text-[#0b66d1]" />
              <h4 className="font-semibold text-gray-900">Business Hours</h4>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Phone & Chat Support</span>
                  <span className="font-medium text-gray-900">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Support</span>
                  <span className="font-medium text-gray-900">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Operations</span>
                  <span className="font-medium text-gray-900">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
