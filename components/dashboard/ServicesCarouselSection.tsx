"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { highlightCards } from "./data";

export default function ServicesCarouselSection() {
  const [servicesStartIndex, setServicesStartIndex] = useState(0);

  const visibleServiceCards = useMemo(() => {
    if (highlightCards.length <= 2) return highlightCards;
    const safeStart = Math.min(servicesStartIndex, highlightCards.length - 2);
    return highlightCards.slice(safeStart, safeStart + 2);
  }, [servicesStartIndex]);

  return (
    <>
      <motion.section
        className="relative w-full overflow-hidden bg-gradient-to-br from-[#0f1723] via-[#162131] to-[#0f1723] px-4 pb-24 pt-16 text-center md:px-6 md:pb-36 md:pt-24"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#f6b73c] blur-3xl" />
          <div className="absolute -right-14 bottom-8 h-44 w-44 rounded-full bg-[#0b66d1] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-3 inline-flex rounded-full border border-[#f6b73c]/40 bg-[#f6b73c]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd889]">
            Black Drivo.
          </p>
          <h2 className="font-serif text-[42px] leading-tight tracking-tight text-white md:text-[72px]">
            Arrive at your best.
          </h2>
          <p className="mt-4 text-base font-medium text-white/80 md:text-[21px]">
            Effortless journeys, tailored to you.
          </p>
          <div className="mx-auto mt-8 h-[2px] w-36 bg-gradient-to-r from-transparent via-[#f6b73c] to-transparent" />
        </div>
      </motion.section>

      <motion.section
        className="-mt-20 w-full overflow-visible bg-[#f6f5f1] px-6 pb-14 pt-6 md:-mt-24 md:px-12 md:pb-20 md:pt-10"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mx-auto grid w-full gap-3 md:grid-cols-2 md:gap-4">
          {visibleServiceCards.map((card) => (
            <motion.article
              key={card.heading}
              className="group relative rounded-2xl p-3 transition-all duration-10 hover:border-black/10 hover:bg-white/70 md:p-4"
            >
              <div className="overflow-hidden rounded-xl">
                <div
                  className="h-auto transition-transform duration-300 ease-out group-hover:scale-[1.035] md:h-[255px]"
                  style={{
                    backgroundImage: `url('${card.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <p className="mt-3 text-[14px] text-black/45">{card.title}</p>
              <h3 className="mt-1 text-[42px] leading-tight font-semibold text-[#16181d] md:text-[44px]">
                {card.heading}
              </h3>
              <p className="mt-2 text-[14px] leading-7 text-black/80 md:text-[16px] md:leading-8">
                {card.description}
              </p>
              <button
                type="button"
                className="mt-4 rounded-full border border-[#0b66d1]/60 bg-transparent px-5 py-1.5 text-[15px] font-medium text-[#0b66d1] transition-all duration-150 group-hover:border-[#0b66d1] group-hover:bg-[#0b66d1] group-hover:text-white md:mt-5"
              >
                Learn more
              </button>
            </motion.article>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setServicesStartIndex((prev) => Math.max(0, prev - 1))}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-black/50 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:bg-[#0f1723] hover:text-white"
          >
            <span className="text-lg leading-none">‹</span>
          </button>
          <button
            onClick={() =>
              setServicesStartIndex((prev) => Math.min(highlightCards.length - 2, prev + 1))
            }
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-black/70 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:bg-[#0f1723] hover:text-white"
          >
            <span className="text-lg leading-none">›</span>
          </button>
        </div>
      </motion.section>
    </>
  );
}
