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
  /**
   * Tipografía de la segunda frase:
   * - "auto": cursiva si son 2 o más palabras, letra normal naranja si es una sola.
   * - "script": siempre cursiva de la marca.
   * - "sans": siempre Helvena Regular, en su propia línea y más pequeña.
   */
  accentFont?: "auto" | "script" | "sans";
  /** Clases extra para la línea de la segunda frase (p. ej. acercarla más al título). */
  accentClassName?: string;
  className?: string;
};

const split = (value: string) => value.split(/\s+/).filter(Boolean);

function wordVariants(from: string, to: string): Variants {
  return {
    hidden: { opacity: 0.4, y: "0.3em", filter: "blur(8px)", color: from },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", color: to, transition: { duration: 0.8, ease: EASE_OUT } },
  };
}

const SCRIPT = "font-script text-[2em] font-normal leading-[0.8]";
const SANS = "text-[0.42em] font-normal leading-tight tracking-normal";

export function RevealText({ text: rawText, accent: rawAccent = "", as = "h2", tone = "dark", delay = 0, accentFont = "auto", accentClassName = "", className }: Props) {
  const t = useT();
  const text = t(rawText);
  const accent = t(rawAccent);
  const Tag = motion[as];
  const colors = COLORS[tone];
  const base = split(text);
  const accents = split(accent);
  const total = base.length + accents.length;
  const own = accents.length > 0 && base.length > 0 && (accentFont !== "auto" || accents.length >= 2);
  const font = accentFont === "sans" ? "sans" : "script";

  const words = (list: string[], color: string, offset: number, extra = "") =>
    list.map((word, i) => (
      <span key={`${offset}-${i}`} aria-hidden>
        <motion.span data-accent={extra ? "" : undefined} className="inline-block" variants={wordVariants(colors.from, color)}>
          {word}
        </motion.span>
        {!(own && offset + i === total - 1) && offset + i < total - 1 && " "}
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
        (own ? (
          // Segunda frase: va en su propia línea y en naranja.
          // El tamaño va en el contenedor para que los espacios entre palabras también se ajusten.
          <span className={`block [word-spacing:normal] ${font === "script" ? `${SCRIPT} -mt-[0.15em]` : `${SANS} mt-[0.25em]`} ${accentClassName}`}>
            {words(accents, colors.accent, base.length, "accent")}
          </span>
        ) : (
          words(accents, colors.accent, base.length)
        ))}
    </Tag>
  );
}
