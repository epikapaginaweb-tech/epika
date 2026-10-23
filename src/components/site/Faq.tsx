import type { Faq as FaqItem } from "@/lib/types";

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-[var(--radius-card)] bg-white px-6 md:px-8">
      {items.map((item) => (
        <details key={item.id} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-semibold text-navy">
            {item.question}
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-lg transition-transform duration-300 group-open:rotate-45 group-open:bg-orange group-open:text-white"
            >
              +
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line pr-12 text-sm leading-relaxed text-ink/70">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
