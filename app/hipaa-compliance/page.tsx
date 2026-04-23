"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { motion } from "framer-motion";

export default function HIPAACompliance() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-green-50 text-slate-800">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-8 text-green-700 text-center"
        >
          HIPAA Compliance
        </motion.h1>

        <p className="text-lg text-slate-700 text-center max-w-3xl mx-auto leading-relaxed">
          At <span className="font-semibold text-green-700">Demeta</span>, your
          data security and patient confidentiality are at the core of
          everything we do. We uphold the highest HIPAA standards to ensure the
          privacy, integrity, and availability of all Protected Health
          Information (PHI).
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          {[
            {
              title: "🔐 End-to-End Encryption",
              desc: "All PHI is encrypted both in transit and at rest using AES-256 standards, preventing unauthorized access and ensuring data safety.",
            },
            {
              title: "👥 Role-Based Access Control",
              desc: "Every team member only accesses data strictly necessary for their role. Multi-factor authentication and audit logs strengthen accountability.",
            },
            {
              title: "🧩 Continuous Monitoring",
              desc: "Our infrastructure is monitored 24/7 for potential threats, ensuring immediate detection and response to anomalies or breaches.",
            },
            {
              title: "📚 Ongoing Compliance Training",
              desc: "We invest in regular HIPAA and security awareness training to maintain a culture of responsibility and compliance.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-8 border border-green-100 hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold text-green-700 mb-3">
                {item.title}
              </h2>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h3 className="text-3xl font-semibold text-green-700 mb-4">
            Our Commitment to Data Privacy
          </h3>
          <p className="text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Demeta’s commitment goes beyond compliance — it’s a promise to
            healthcare providers and patients that every digital interaction is
            handled with utmost security and trust.
          </p>
        </div>
      </section>
    </main>
  );
}
