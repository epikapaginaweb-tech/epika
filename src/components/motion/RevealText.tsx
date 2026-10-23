"use client";

import { motion, type Variants } from "motion/react";
import { EASE_OUT } from "./ease";

type Tone = "dark" | "light";

const COLORS: Record<Tone, { from: string; base: string; accent: string }> = {
  dark: { from: "#d4d7dc", base: "#0d284f", accent: "#ff9100" },
  light: { from: "rgba(255,255,255,0.25)", base: "#ffffff", accent: "#ff9100" },
};

type Props = {
  text: string;
  accent?: string;
  as?: "h1" | "h2" | "h3" | "p";
  tone?: Tone;
  delay?: number;
  underline?: boolean;
  className?: string;
};

const split = (value: string) => value.split(/\s+/).filter(Boolean);

function wordVariants(from: string, to: string): Variants {
  return {
    hidden: { opacity: 0.4, y: "0.3em", filter: "blur(8px)", color: from },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", color: to, transition: { duration: 0.8, ease: EASE_OUT } },
  };
}

export function RevealText({ text, accent = "", as = "h2", tone = "dark", delay = 0, underline = false, className }: Props) {
  const Tag = motion[as];
  const colors = COLORS[tone];
  const base = split(text);
  const accents = split(accent);
  const total = base.length + accents.length;

  const words = (list: string[], color: string, offset: number) =>
    list.map((word, i) => (
      <span key={`${offset}-${i}`} aria-hidden>
        <motion.span className="inline-block" variants={wordVariants(colors.from, color)}>
          {word}
        </motion.span>
        {offset + i < total - 1 && " "}
      </span>
    ));

  return (
    <Tag
      className={className}
      aria-label={[text, accent].filter(Boolean).join(" ")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {words(base, colors.base, 0)}
      {accents.length > 0 &&
        (underline ? (
          <span className="relative inline-block">
            {words(accents, colors.accent, base.length)}
            <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full overflow-visible">
              <motion.path
                d="M3 8.5C48 3 120 2.5 197 6"
                fill="none"
                stroke="#ff9100"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: EASE_OUT, delay: 0.35 } },
                }}
              />
            </svg>
          </span>
        ) : (
          words(accents, colors.accent, base.length)
        ))}
    </Tag>
  );
}
