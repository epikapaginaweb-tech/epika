"use client";

import { motion, useScroll, useTransform } from "motion/react";

const SHAPES = [
  { top: "8%", left: "4%", size: 46, speed: -120, kind: "ring", color: "#fd8901", duration: 9 },
  { top: "18%", left: "88%", size: 18, speed: -260, kind: "dot", color: "#002952", duration: 7 },
  { top: "62%", left: "93%", size: 54, speed: -80, kind: "plus", color: "#fd8901", duration: 11 },
  { top: "78%", left: "6%", size: 22, speed: -200, kind: "dot", color: "#fd8901", duration: 8 },
  { top: "40%", left: "48%", size: 30, speed: -160, kind: "arrow", color: "#002952", duration: 10 },
  { top: "86%", left: "60%", size: 40, speed: -100, kind: "ring", color: "#002952", duration: 12 },
];

function Shape({ kind, color, size }: { kind: string; color: string; size: number }) {
  if (kind === "dot") return <span className="block rounded-full" style={{ width: size, height: size, background: color }} />;
  if (kind === "ring") return <span className="block rounded-full border-[3px]" style={{ width: size, height: size, borderColor: color }} />;
  if (kind === "plus")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
        <path d="M12 4v16M4 12h16" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16c4-8 10-10 16-8M15 4l5 4-4 5" />
    </svg>
  );
}

function Floating({ shape }: { shape: (typeof SHAPES)[number] }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 3000], [0, shape.speed]);
  return (
    <motion.div className="absolute opacity-40" style={{ top: shape.top, left: shape.left, y }}>
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 18, 0] }}
        transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shape kind={shape.kind} color={shape.color} size={shape.size} />
      </motion.div>
    </motion.div>
  );
}

export function FloatingShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {SHAPES.map((shape, i) => (
        <Floating key={i} shape={shape} />
      ))}
    </div>
  );
}
