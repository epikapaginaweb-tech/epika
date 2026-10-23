"use client";

import { motion } from "motion/react";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat({ href }: { href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.7)] md:bottom-7 md:right-7"
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.4 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.4s]" />
      <WhatsAppIcon className="size-7" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-500 group-hover:max-w-40 group-hover:pr-1 md:inline">
        ¿Hablamos?
      </span>
    </motion.a>
  );
}
