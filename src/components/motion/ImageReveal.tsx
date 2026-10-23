"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { EASE_OUT } from "./ease";

export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className ?? ""}`}
      initial={{ clipPath: "inset(100% 0% 0% 0% round 2rem)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2rem)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE_OUT }}
    >
      <motion.div className="absolute inset-[-10%]" style={{ y }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
