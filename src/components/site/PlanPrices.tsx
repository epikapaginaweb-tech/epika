"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Plan = { label: string; price: string; note: string };

/** Precios del plan contado / crédito; al pasar el cursor (o tocar) aparece cómo funciona cada uno. */
export function PlanPrices({ plans, className = "justify-end" }: { plans: Plan[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (plans.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-end gap-x-10 gap-y-6 ${className}`}>
      {plans.map((plan, i) => (
        <div
          key={plan.label}
          className="relative text-right"
          onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
        >
          <button
            type="button"
            className="text-right"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onFocus={() => setOpen(i)}
            onBlur={() => setOpen(null)}
          >
            <span className="block text-sm text-ink/55 underline decoration-dotted underline-offset-4">{plan.label}</span>
            <span className="bolder block text-4xl font-bold leading-none text-navy md:text-5xl">{plan.price}</span>
          </button>
          <AnimatePresence>
            {open === i && plan.note && (
              // Burbuja tipo mensaje de WhatsApp
              <motion.div
                role="tooltip"
                className="absolute bottom-full right-0 z-30 mb-3 w-64 origin-bottom-right"
                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              >
                <div className="relative rounded-2xl rounded-br-sm bg-[#dcf8c6] px-3.5 pb-1.5 pt-2.5 text-left shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]">
                  <span className="block text-[0.72rem] font-bold text-[#128c4a]">Épika Academy</span>
                  <span className="mt-0.5 block text-[0.82rem] leading-snug text-[#111b21]">{plan.note}</span>
                  <span className="mt-1 flex items-center justify-end gap-1 text-[0.62rem] text-[#667781]">
                    {plan.label}
                    <svg aria-hidden viewBox="0 0 16 11" className="h-2.5 w-3.5 text-[#53bdeb]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 6l3 3 6-7M6 9l1 1 7-8" />
                    </svg>
                  </span>
                  <span aria-hidden className="absolute -bottom-[6px] right-0 size-3 bg-[#dcf8c6]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
