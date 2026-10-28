"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "motion/react";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/** Cuenta de 0 al valor final (p. ej. 0 → 500) cuando entra en pantalla. */
function CountUp({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 2.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setCurrent(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);

  const format = (n: number) => new Intl.NumberFormat("es-EC").format(n);
  return (
    <span ref={ref} className="inline-flex items-baseline">
      <span className="sr-only">{`${prefix}${format(value)}${suffix}`}</span>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {format(current)}
        {suffix}
      </span>
    </span>
  );
}

export function Odometer({ value, prefix = "", suffix = "", plain = false }: { value: number; prefix?: string; suffix?: string; plain?: boolean }) {
  if (plain) return <CountUp value={value} prefix={prefix} suffix={suffix} />;
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
