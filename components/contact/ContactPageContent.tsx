"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import ContactModal, { type ContactTeam } from "./ContactModal";

const teams: (ContactTeam & { description: string })[] = [
  {
    id: "passenger",
    title: "Passenger Support",
    email: "support@blackdrivo.com",
    description: "Booking help, ride issues, refunds, and general questions about your trips.",
  },
  {
    id: "partner",
    title: "Partner Support",
    email: "partner@blackdrivo.com",
    description: "For driver partners — applications, payments, documents, and account help.",
  },
  {
    id: "agency",
    title: "Travel Agency",
    email: "b2b@blackdrivo.com",
    description: "For B2B travel agencies booking ground transportation on behalf of their clients.",
  },
  {
    id: "business",
    title: "Business Partnerships",
    email: "business@blackdrivo.com",
    description: "For clients on monthly or on-demand service agreements — airlines, companies, and corporate accounts.",
  },
];

export default function ContactPageContent() {
  const [activeTeam, setActiveTeam] = useState<ContactTeam | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden">
        <Image
          src="/contact-support-hero.jpg"
          alt="BlackDrivo support team"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(10,15,26,0.45) 0%, rgba(10,15,26,0.7) 100%)",
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-24 text-center md:px-6"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            We&apos;re here to help
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
            Have a question, need a custom quote, or want to set up a corporate account?
            Our team is available 24/7 to assist you.
          </p>
        </motion.div>
      </section>

      {/* Contact our teams */}
      <section className="relative z-10 bg-white px-4 py-20 md:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Contact our teams
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {teams.map((team) => (
              <motion.div
                key={team.id}
                variants={fadeUp}
                className="group rounded-[2rem] p-3 transition-colors duration-300 hover:bg-blue-50"
              >
                <div className="flex min-h-[340px] flex-col rounded-2xl bg-gray-50 p-6">
                  <h3 className="text-lg font-bold text-gray-900">{team.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">{team.description}</p>
                  <button
                    onClick={() => setActiveTeam(team)}
                    className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-[#0b66d1] transition hover:gap-3"
                  >
                    Contact us <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ContactModal team={activeTeam} onClose={() => setActiveTeam(null)} />
    </>
  );
}
