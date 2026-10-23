"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";

export function StickyCta({ href, title, price }: { href: string; title: string; price: string | null }) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 650));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 left-4 right-24 z-40 flex items-center justify-between gap-3 rounded-full bg-navy py-2 pl-5 pr-2 text-white shadow-2xl md:hidden"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <span className="min-w-0">
            <span className="block truncate text-xs text-white/60">{title}</span>
            {price && <span className="block text-sm font-bold text-orange">{price}</span>}
          </span>
          <Link href={href} className="shrink-0 rounded-full bg-orange px-4 py-2.5 text-xs font-bold">
            Reservar
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
