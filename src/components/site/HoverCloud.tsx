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
  /** Desplaza la nube en px hacia el centro para que no se salga de la pantalla. */
  shift?: number;
  /** Compensa escalas del contenedor para que el texto se lea igual. */
  cloudClassName?: string;
  children: React.ReactNode | ((open: boolean) => React.ReactNode);
};

/**
 * Tarjeta con nube informativa: con el cursor (o con un toque en pantallas táctiles)
 * la tarjeta se sobrepone y aparece una nube con datos del programa.
 */
export function HoverCloud({ href, info, ariaLabel, className = "", linkClassName = "", pop, shift = 0, cloudClassName = "", children }: Props) {
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
            className="absolute bottom-[94%] left-1/2 z-50 w-60 origin-bottom"
            style={{ x: `calc(-50% + ${shift}px)` }}
            initial={{ opacity: 0, scale: 0.5, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
          >
            <div className={`origin-bottom ${cloudClassName}`}>
              <div className="relative rounded-[1.6rem] bg-white p-4 text-left text-navy shadow-[0_24px_60px_-18px_rgba(13,40,79,0.55)] ring-1 ring-navy/10">
                <p className="text-base font-bold leading-tight tracking-tight">{info.title}</p>
                {info.text && <p className="mt-1.5 line-clamp-4 text-[0.8rem] font-normal leading-snug tracking-normal text-ink/70">{info.text}</p>}
                {info.chips && info.chips.length > 0 && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {info.chips.map((chip) => (
                      <li key={chip} className="rounded-full bg-paper px-2.5 py-0.5 text-[0.7rem] font-semibold tracking-normal text-navy">
                        {chip}
                      </li>
                    ))}
                  </ul>
                )}
                {info.cta && <p className="font-script mt-2 text-2xl leading-none text-orange">{info.cta} →</p>}
                <span aria-hidden className="absolute -bottom-1.5 size-4 rotate-45 rounded-[3px] bg-white " style={{ left: `calc(50% - 0.5rem - ${shift}px)` }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
