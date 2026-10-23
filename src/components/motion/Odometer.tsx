"use client";

import { motion } from "motion/react";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

export function Odometer({ value, prefix = "", suffix = "", plain = false }: { value: number; prefix?: string; suffix?: string; plain?: boolean }) {
  const text = new Intl.NumberFormat("es-EC").format(value);
  const chars = text.split("");
  let digitIndex = 0;

  return (
    <span className="inline-flex items-baseline">
      <span className="sr-only">{`${prefix}${text}${suffix}`}</span>
      <motion.span
        aria-hidden
        className="inline-flex items-baseline tabular-nums"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        {prefix && <span className={plain ? "" : "text-orange"}>{prefix}</span>}
        {chars.map((char, i) => {
          if (!/\d/.test(char)) return <span key={i}>{char === " " || char === " " ? " " : char}</span>;
          const digit = Number(char);
          const order = digitIndex++;
          return (
            <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none">
              <motion.span
                className="flex flex-col"
                variants={{
                  hidden: { y: "0%" },
                  visible: {
                    y: `-${digit * 10}%`,
                    transition: { type: "spring", stiffness: 40, damping: 14, delay: 0.15 + order * 0.08 },
                  },
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="h-[1em] leading-none">
                    {d}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
        {suffix && <span className="text-orange">{suffix}</span>}
      </motion.span>
    </span>
  );
}
