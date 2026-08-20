"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

interface ClientBanner {
  id: string;
  image_url: string;
  name: string | null;
}

export default function OurClients() {
  const [logos, setLogos] = useState<ClientBanner[]>([]);

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
    };
    load();
  }, []);

  if (logos.length === 0) return null;

  return (
    <section className="w-full bg-gray-50 px-4 py-20 md:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#0b66d1]">
            Our Clients
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Who we serve
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            From boardroom to airport, BlackDrivo is trusted by businesses and
            individuals across New York, New Jersey, and the tri-state area.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10"
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.id}
              variants={fadeUp}
              className="flex h-14 w-32 items-center justify-center grayscale transition hover:grayscale-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.image_url}
                alt={logo.name || "Client logo"}
                className="max-h-14 max-w-32 object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
