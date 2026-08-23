"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

interface ClientBanner {
  id: string;
  image_url: string;
  name: string | null;
}

export default function OurClients() {
  const [logos, setLogos] = useState<ClientBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });
  const headingScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await (supabase as any)
        .from("client_banners")
        .select("id,image_url,name")
        .eq("is_active", true)
        .not("image_url", "eq", "")
        .order("sort_order");
      setLogos(data || []);
      setLoading(false);
    };
    load();
  }, []);

  // Wait until the fetch resolves before deciding to hide the section — bailing out
  // on the empty initial state would unmount headingRef before useScroll can attach
  // to it (framer-motion's "target ref is defined but not hydrated" error).
  if (!loading && logos.length === 0) return null;

  return (
    <section className="relative z-10 flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto w-full max-w-[1800px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <motion.h2
            ref={headingRef}
            style={{ scale: headingScale, opacity: headingOpacity }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-7xl lg:text-8xl"
          >
            Who we serve
          </motion.h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-gray-600 md:text-2xl">
            From boardroom to airport, BlackDrivo is trusted by businesses and
            individuals across New York, New Jersey, and the tri-state area.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-wrap items-center justify-center gap-x-24 gap-y-16"
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              variants={fadeUp}
              className="flex h-28 w-60 items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.image_url}
                alt={logo.name || "Client logo"}
                className="max-h-28 max-w-60 object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
