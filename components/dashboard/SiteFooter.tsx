"use client";

import { Headphones, MapPin } from "lucide-react";
import Link from "next/link";
import { footerColumns } from "./data";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#f6f5f1]">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-5">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4 className="text-base font-semibold">{column.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-black/65">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-black">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-base font-semibold">Support</h4>
          <ul className="mt-4 space-y-3 text-sm text-black/65">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-black/50" />
              <span>United States operations</span>
            </li>
            <li className="flex items-start gap-2">
              <Headphones className="mt-0.5 h-4 w-4 text-black/50" />
              <span>24/7 help: Hello@blackdrivo.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/10">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-6 py-5 text-sm text-black/60 md:flex-row md:items-center md:justify-between">
          <p>©2026 BlackDrivo Inc.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-black">
              Terms
            </a>
            <Link href="/privacy-policy" className="hover:text-black">
              Privacy policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-black">
              Legal notice
            </Link>
            <a href="#" className="hover:text-black">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
