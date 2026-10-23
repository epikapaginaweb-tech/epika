"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CourseImage } from "./CourseImage";
import { HoverCloud, type CloudInfo } from "./HoverCloud";

export type FanItem = {
  key: string;
  title: string;
  image: string | null;
  tag: string;
  href: string;
  seed?: string;
  badge?: string;
  info?: CloudInfo;
};

// Línea de tiempo de la apertura: título → una tarjeta cae al centro → el abanico se abre → burbujas → botón.
const DROP_AT = 0.9;
const FAN_AT = 1.95;

const SPREAD = 150;

function placement(i: number, n: number) {
  const k = i - (n - 1) / 2;
  return { x: k * SPREAD, y: Math.abs(k) * Math.abs(k) * 7, rotate: k * 5, z: 20 - Math.round(Math.abs(k) * 2) };
}

function FanCard({ item, index, total, progress }: { item: FanItem; index: number; total: number; progress: MotionValue<number> }) {
  const { x, y, rotate, z } = placement(index, total);
  const center = Math.floor(total / 2);
  const isCenter = index === center;
  const dist = Math.abs(index - center);
  const gather = useTransform(progress, [0, 1], [0, -x * 0.82]);
  const lift = useTransform(progress, [0, 1], [0, -y + 60]);
  const straighten = useTransform(progress, [0, 1], [0, -rotate * 0.6]);
  const info = item.info ?? { title: item.title };

  return (
    <motion.div
      className="absolute left-1/2 top-0 -ml-[5.5rem] md:-ml-[6.25rem]"
      style={{ zIndex: z }}
      initial={isCenter ? { x, y: -460, rotate: -18, scale: 0.85, opacity: 0 } : { x: 0, y: 0, rotate: 0, scale: 0.9, opacity: 0 }}
      animate={isCenter ? { x, y, rotate: [-18, 7, 0], scale: 1, opacity: 1 } : { x, y, rotate, scale: 1, opacity: 1 }}
      transition={
        isCenter
          ? {
              y: { type: "spring", stiffness: 80, damping: 12, delay: DROP_AT },
              rotate: { duration: 1.2, times: [0, 0.55, 1], ease: "easeOut", delay: DROP_AT },
              scale: { duration: 0.5, delay: DROP_AT },
              opacity: { duration: 0.25, delay: DROP_AT },
            }
          : { type: "spring", stiffness: 70, damping: 15, delay: FAN_AT + dist * 0.12, opacity: { duration: 0.2, delay: FAN_AT + dist * 0.12 } }
      }
    >
      <motion.div style={{ x: gather, y: lift, rotate: straighten }}>
        <HoverCloud
          href={item.href}
          ariaLabel={item.title}
          info={info}
          pop={{ y: -22, scale: 1.06, rotate: -rotate }}
          side={x > 0 ? "right" : "left"}
          shift={-x * 0.28}
          cloudClassName="scale-[1.6] sm:scale-125 lg:scale-100"
          linkClassName="shine group relative block h-56 w-44 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_24px_50px_-20px_rgba(0,41,82,0.45)] ring-4 ring-white md:h-64 md:w-50"
        >
          <CourseImage src={item.image} title={item.title} sizes="200px" eager label={item.title} seed={item.seed} />
          {item.badge && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-orange px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white shadow-md">
              {item.badge}
            </span>
          )}
        </HoverCloud>
      </motion.div>
    </motion.div>
  );
}

export function CourseFan({ items }: { items: FanItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end start"] });
  const total = items.length;
  const first = items[1] ?? items[0];
  const last = items[total - 2] ?? items[total - 1];

  return (
    <div ref={ref} className="relative mx-auto h-[12.5rem] w-full max-w-5xl sm:h-[17rem] lg:h-[22rem]">
      <div className="absolute inset-x-0 top-0 origin-top scale-[0.62] sm:scale-[0.8] lg:scale-100">
        {items.map((item, i) => (
          <FanCard key={item.key} item={item} index={i} total={total} progress={scrollYProgress} />
        ))}
      </div>
      {first && first.tag && (
        <motion.span
          className="bubble absolute left-[8%] top-[-0.5rem] z-30 bg-navy text-white md:left-[16%]"
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: FAN_AT + 0.9 }}
        >
          {first.tag}
        </motion.span>
      )}
      {last && last !== first && last.tag && (
        <motion.span
          className="bubble absolute right-[8%] top-6 z-30 bg-orange text-white md:right-[16%]"
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: FAN_AT + 1.05 }}
        >
          {last.tag}
        </motion.span>
      )}
    </div>
  );
}
