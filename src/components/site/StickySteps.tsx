"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";

type Step = { title: string; text: string };

export function StickySteps({ eyebrow, title, accent, steps }: { eyebrow: string; title: string; accent: string; steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.floor(v * steps.length)));
  });

  return (
    <div ref={ref} className="relative" style={{ height: `${steps.length * 45 + 30}vh` }}>
      <div className="sticky top-0 flex min-h-dvh items-center py-14">
        <div className="container-page grid w-full items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <p className="eyebrow">
              {eyebrow.split(" ")[0]} <span className="text-orange">{eyebrow.split(" ").slice(1).join(" ")}</span>
            </p>
            <h2 className="bolder mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-navy md:text-5xl">
              {title}
              {accent.trim().split(/\s+/).length >= 2 ? (
                <span className="font-script mt-2 block text-[1.6em] font-normal leading-[1.1] text-orange">{accent}</span>
              ) : (
                <span className="text-orange"> {accent}</span>
              )}
            </h2>
            <div className="mt-8 hidden items-end gap-3 md:flex">
              <motion.span key={active} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-8xl font-extrabold leading-none tracking-tighter text-orange">
                {String(active + 1).padStart(2, "0")}
              </motion.span>
              <span className="pb-2 text-sm font-semibold text-ink/40">/ {String(steps.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute bottom-2 left-0 top-2 w-1 rounded-full bg-line">
              <motion.div className="h-full w-full origin-top rounded-full bg-orange" style={{ scaleY: fill }} />
            </div>
            <ol className="space-y-3">
              {steps.map((step, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <motion.li
                    key={step.title}
                    animate={{ opacity: on ? 1 : done ? 0.55 : 0.35, x: on ? 0 : 12, scale: on ? 1 : 0.97 }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className={`relative rounded-[1.5rem] p-6 transition-colors duration-500 md:p-7 ${on ? "bg-navy text-white shadow-[0_30px_60px_-30px_rgba(0,41,82,0.6)]" : "bg-white text-ink"}`}
                  >
                    <span
                      className={`absolute -left-[2.15rem] top-8 size-4 rounded-full border-4 transition-colors duration-500 ${on || done ? "border-orange bg-white" : "border-line bg-white"}`}
                    />
                    <p className={`text-xs font-bold ${on ? "text-orange" : "text-ink/40"}`}>Paso {i + 1}</p>
                    <p className={`mt-1 text-xl font-bold tracking-tight ${on ? "text-white" : "text-navy"}`}>{step.title}</p>
                    <p className={`mt-2 text-sm leading-relaxed ${on ? "text-white/75" : "text-ink/60"}`}>{step.text}</p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
