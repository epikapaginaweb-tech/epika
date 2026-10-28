"use client";

import Image from "next/image";
import { motion } from "motion/react";

export type StickerName =
  | "carita"
  | "reloj"
  | "tecla-f9"
  | "certificado"
  | "megafono"
  | "firma-lapiz"
  | "paz"
  | "cursor"
  | "lapiz"
  | "compu"
  | "manos"
  | "envivo";

// Dimensiones reales de cada PNG (ancho × alto) para conservar la proporción.
const DIMENSIONS: Record<StickerName, [number, number]> = {
  carita: [462, 473],
  reloj: [430, 503],
  "tecla-f9": [498, 520],
  certificado: [508, 491],
  megafono: [520, 513],
  "firma-lapiz": [520, 405],
  paz: [470, 520],
  cursor: [397, 520],
  lapiz: [422, 484],
  compu: [520, 489],
  manos: [458, 424],
  envivo: [458, 312],
};

type Props = {
  name: StickerName;
  /** Lado mayor en píxeles. */
  size?: number;
  rotate?: number;
  delay?: number;
  float?: boolean;
  className?: string;
};

/** Icono estilo sticker del moodboard (borde hueso y sombra suave), con flote suave opcional. */
export function Sticker({ name, size = 80, rotate = 0, delay = 0, float = true, className = "" }: Props) {
  const [w, h] = DIMENSIONS[name];
  const scale = size / Math.max(w, h);
  const width = Math.round(w * scale);
  const height = Math.round(h * scale);

  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none inline-block select-none ${className}`}
      initial={{ opacity: 0, scale: 0.4, rotate: rotate - 14 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
    >
      <motion.span
        className="block"
        animate={float ? { y: [0, -9, 0], rotate: [0, 3, 0] } : undefined}
        transition={float ? { duration: 5 + (delay % 2), repeat: Infinity, ease: "easeInOut", delay } : undefined}
      >
        <Image src={`/brand/iconos/${name}.png`} alt="" width={width} height={height} sizes={`${width}px`} draggable={false} />
      </motion.span>
    </motion.span>
  );
}
