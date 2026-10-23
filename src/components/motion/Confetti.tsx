"use client";

import { motion } from "motion/react";

const COLORS = ["#fd8901", "#002952", "#ffe9cf", "#ffb357", "#ffffff"];
const PIECES = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2 + (i % 3) * 0.2;
  const distance = 140 + ((i * 47) % 120);
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 80,
    rotate: ((i * 73) % 360) - 180,
    color: COLORS[i % COLORS.length],
    w: 6 + (i % 3) * 3,
    h: i % 2 ? 6 : 12,
  };
});

export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-16 z-20">
      {PIECES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-sm"
          style={{ width: p.w, height: p.h, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.rotate * 3, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.4, 1] }}
        />
      ))}
    </div>
  );
}
