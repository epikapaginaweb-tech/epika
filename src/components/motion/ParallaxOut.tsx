"use client";

import { motion, useScroll, useTransform } from "motion/react";

export function ParallaxOut({ children, className }: { children: React.ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 420], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.92]);
  const blur = useTransform(scrollY, [0, 500], ["blur(0px)", "blur(6px)"]);

  return (
    <motion.div className={className} style={{ y, opacity, scale, filter: blur }}>
      {children}
    </motion.div>
  );
}
