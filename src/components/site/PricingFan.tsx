"use client";

import { motion } from "motion/react";

export type PriceCard = { label: string; title: string; items: string[]; highlight?: boolean };

const LAYOUT = [
  { x: 40, rotate: -6, y: 24 },
  { x: 0, rotate: 0, y: 0 },
  { x: -40, rotate: 6, y: 24 },
];

export function PricingFan({ cards }: { cards: PriceCard[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3 md:gap-0">
      {cards.map((card, i) => {
        const pos = LAYOUT[cards.length === 3 ? i : 1];
        return (
          <motion.div
            key={card.label}
            className={`relative rounded-[var(--radius-card)] p-7 md:p-8 ${
              card.highlight
                ? "z-10 bg-orange text-white shadow-[0_40px_70px_-30px_rgba(253,137,1,0.65)] md:-my-6"
                : "bg-white text-ink shadow-[0_30px_60px_-40px_rgba(0,41,82,0.45)]"
            }`}
            initial={{ opacity: 0, x: pos.x * 3, y: 60, rotate: pos.rotate * 2 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 60, damping: 14, delay: i * 0.1 }}
            whileHover={{ y: -10 }}
          >
            <p className={`eyebrow ${card.highlight ? "!text-white/80" : ""}`}>{card.label}</p>
            <p className={`mt-3 text-3xl font-extrabold tracking-tight ${card.highlight ? "" : "text-navy"}`}>{card.title}</p>
            {card.items.length > 0 && (
              <ul className="mt-6 space-y-2.5 text-sm">
                {card.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className={card.highlight ? "text-white" : "text-orange"}>●</span>
                    <span className={card.highlight ? "text-white/90" : "text-ink/75"}>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
