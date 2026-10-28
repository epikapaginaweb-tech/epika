"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Plan = { label: string; price: string; note: string };

/** Precios del plan contado / crédito; al pasar el cursor (o tocar) aparece cómo funciona cada uno. */
export function PlanPrices({ plans }: { plans: Plan[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (plans.length === 0) return null;

  return (
    <div className="flex flex-wrap items-end justify-end gap-x-10 gap-y-4">
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
              <motion.div
                role="tooltip"
                className="absolute bottom-full right-0 z-30 mb-3 w-60 rounded-[1.1rem] rounded-br-[0.35rem] bg-navy px-4 py-3 text-left text-xs leading-relaxed text-white shadow-xl"
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
              >
                <span className="mb-1 block font-bold text-orange">¿Cómo funciona?</span>
                {plan.note}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
