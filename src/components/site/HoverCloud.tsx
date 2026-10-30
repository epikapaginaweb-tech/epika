"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type CloudInfo = {
  title: string;
  text?: string | null;
  chips?: string[];
  cta?: string;
};

type Pop = { y?: number; scale?: number; rotate?: number };

type Props = {
  href: string;
  info: CloudInfo;
  ariaLabel: string;
  className?: string;
  linkClassName?: string;
  /** Efecto de "saltar al frente" al abrir la nube. */
  pop?: Pop;
  /** Lado de la tarjeta donde nace la burbuja. */
  side?: "left" | "right";
  /** Desplaza la burbuja en px hacia el centro para que no se salga de la pantalla. */
  shift?: number;
  /** Compensa escalas del contenedor para que el texto se lea igual. */
  cloudClassName?: string;
  children: React.ReactNode | ((open: boolean) => React.ReactNode);
};

/**
 * Tarjeta con nube informativa: con el cursor (o con un toque en pantallas táctiles)
 * la tarjeta se sobrepone y aparece una nube con datos del programa.
 */
export function HoverCloud({ href, info, ariaLabel, className = "", linkClassName = "", pop, side = "left", shift = 0, cloudClassName = "", children }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useRef<string>("mouse");

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const right = side === "right";
  const { y = -12, scale = 1.05, rotate = 0 } = pop ?? {};

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ zIndex: open ? 80 : undefined }}
      animate={open ? { y, scale, rotate } : { y: 0, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPointerDown={(e) => {
        pointer.current = e.pointerType;
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className={linkClassName}
        onClick={(e) => {
          if (pointer.current !== "mouse" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {typeof children === "function" ? children(open) : children}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            className={`absolute bottom-[97%] z-50 w-52 ${right ? "right-1 origin-bottom-right" : "left-1 origin-bottom-left"}`}
            style={{ x: shift }}
            initial={{ opacity: 0, scale: 0.4, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 8, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 420, damping: 19 }}
          >
            <div className={`${right ? "origin-bottom-right" : "origin-bottom-left"} ${cloudClassName}`}>
              {/* Burbuja tipo chat (Messenger / iMessage) */}
              <div
                className={`relative bg-navy px-3.5 py-2.5 text-left text-white shadow-[0_12px_28px_-10px_rgba(13,40,79,0.6)] ring-1 ring-white/15 ${
                  right ? "rounded-[1.1rem] rounded-br-[0.35rem]" : "rounded-[1.1rem] rounded-bl-[0.35rem]"
                }`}
              >
                <p className="text-[0.86rem] font-bold leading-tight tracking-tight">{info.title}</p>
                {info.text && <p className="mt-1 line-clamp-2 text-[0.82rem] font-bold leading-snug tracking-normal text-orange">{info.text}</p>}
                {info.chips && info.chips.length > 0 && (
                  <p className="mt-1.5 text-[0.68rem] font-semibold leading-snug tracking-normal text-white/60">{info.chips.join(" · ")}</p>
                )}
                {info.cta && <p className="mt-1.5 text-[0.72rem] font-bold tracking-normal text-orange">{info.cta} →</p>}
                <span
                  aria-hidden
                  className={`absolute -bottom-[5px] size-3 bg-navy ${right ? "right-0" : "left-0"}`}
                  style={{ clipPath: right ? "polygon(0 0, 100% 0, 100% 100%)" : "polygon(0 0, 100% 0, 0 100%)" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
