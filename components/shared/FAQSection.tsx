// components/shared/FAQSection.tsx
// Renders both the visible FAQ accordion AND its matching FAQPage JSON-LD
// from the same `items` array — keeping structured data and on-page content
// in sync is what search engines expect (and what AI answer engines pull
// their direct-quote answers from).
import type { ReactNode } from "react";

export type FAQItem = { q: string; a: string };

export default function FAQSection({
  items,
  title = "Frequently Asked Questions",
  subtitle,
}: {
  items: FAQItem[];
  title?: string;
  subtitle?: ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="relative z-10 border-t border-gray-100 bg-white px-4 py-16 md:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-500">{subtitle}</p>}
        <div className="mt-8 divide-y divide-gray-100">
          {items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-gray-900 marker:content-none">
                {item.q}
                <span className="shrink-0 text-xl text-gray-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
