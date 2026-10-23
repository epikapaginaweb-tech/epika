"use client";

import { motion } from "motion/react";

export function Wordmark({ text }: { text: string }) {
  return (
    <motion.p
      aria-hidden
      className="select-none overflow-hidden text-center pb-[0.08em] text-[22vw] font-extrabold leading-[0.9] tracking-tighter text-navy md:text-[17vw]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className={`inline-block cursor-default transition-colors duration-300 hover:text-orange ${i === 0 ? "text-orange" : ""}`}
          variants={{
            hidden: { y: "100%", rotate: 8 },
            visible: { y: "0%", rotate: 0, transition: { type: "spring", stiffness: 90, damping: 14 } },
          }}
          whileHover={{ y: "-8%" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}
