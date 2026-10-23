"use client";

import { motion, type Variants } from "motion/react";
import { useT } from "@/lib/i18n/store";
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
  className?: string;
};

const split = (value: string) => value.split(/\s+/).filter(Boolean);

function wordVariants(from: string, to: string): Variants {
  return {
    hidden: { opacity: 0.4, y: "0.3em", filter: "blur(8px)", color: from },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", color: to, transition: { duration: 0.8, ease: EASE_OUT } },
  };
}

export function RevealText({ text: rawText, accent: rawAccent = "", as = "h2", tone = "dark", delay = 0, className }: Props) {
  const t = useT();
  const text = t(rawText);
  const accent = t(rawAccent);
  const Tag = motion[as];
  const colors = COLORS[tone];
  const base = split(text);
  const accents = split(accent);
  const total = base.length + accents.length;
  const phrase = accents.length >= 2 && base.length > 0;

  const words = (list: string[], color: string, offset: number, extra = "") =>
    list.map((word, i) => (
      <span key={`${offset}-${i}`} aria-hidden>
        <motion.span data-accent={extra ? "" : undefined} className={`inline-block ${extra}`} variants={wordVariants(colors.from, color)}>
          {word}
        </motion.span>
        {!(phrase && offset + i === total - 1) && offset + i < total - 1 && " "}
      </span>
    ));

  return (
    <Tag
      className={className}
      data-no-translate
      data-tone={tone}
      aria-label={[text, accent].filter(Boolean).join(" ")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      {words(base, colors.base, 0)}
      {accents.length > 0 &&
        (phrase ? (
          // Dos frases: la segunda va en cursiva de la marca, en naranja y en su propia línea.
          <span className="mt-[0.12em] block">{words(accents, colors.accent, base.length, "font-script text-[1.3em] font-normal leading-[0.9]")}</span>
        ) : (
          words(accents, colors.accent, base.length)
        ))}
    </Tag>
  );
}
