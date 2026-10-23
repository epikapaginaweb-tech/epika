"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollScale({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 32]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 0]);

  return (
    <motion.div ref={ref} className={className} style={{ scale, borderRadius: radius, rotate }}>
      {children}
    </motion.div>
  );
}
