"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CourseImage } from "./CourseImage";

export type FanItem = {
  key: string;
  title: string;
  image: string | null;
  tag: string;
  href: string;
  seed?: string;
  badge?: string;
};

const SPREAD = 150;

function placement(i: number, n: number) {
  const k = i - (n - 1) / 2;
  return { x: k * SPREAD, y: Math.abs(k) * Math.abs(k) * 7, rotate: k * 5, z: 20 - Math.round(Math.abs(k) * 2) };
}

function FanCard({ item, index, total, progress }: { item: FanItem; index: number; total: number; progress: MotionValue<number> }) {
  const { x, y, rotate, z } = placement(index, total);
  const gather = useTransform(progress, [0, 1], [0, -x * 0.82]);
  const lift = useTransform(progress, [0, 1], [0, -y + 60]);
  const straighten = useTransform(progress, [0, 1], [0, -rotate * 0.6]);

  return (
    <motion.div
      className="absolute left-1/2 top-0 -ml-[5.5rem] md:-ml-[6.25rem]"
      style={{ zIndex: z }}
      initial={{ x: 0, y: 260, rotate: 0, scale: 0.7, opacity: 0 }}
      animate={{ x, y, rotate, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.35 + index * 0.07 }}
    >
      <motion.div style={{ x: gather, y: lift, rotate: straighten }}>
        <motion.div whileHover={{ y: -22, scale: 1.06, rotate: -rotate }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <Link
            href={item.href}
            className="shine group relative block h-56 w-44 overflow-hidden rounded-[1.4rem] bg-white shadow-[0_24px_50px_-20px_rgba(0,41,82,0.45)] ring-4 ring-white md:h-64 md:w-50"
            aria-label={item.title}
          >
            <CourseImage src={item.image} title={item.title} sizes="200px" eager label={item.title} seed={item.seed} />
            {item.badge && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-orange px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-white shadow-md">
                {item.badge}
              </span>
            )}
          </Link>
        </motion.div>
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
      {first && (
        <motion.span
          className="bubble absolute left-[8%] top-[-0.5rem] z-30 bg-navy text-white md:left-[16%]"
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 1.2 }}
        >
          {first.tag}
        </motion.span>
      )}
      {last && last !== first && (
        <motion.span
          className="bubble absolute right-[8%] top-6 z-30 bg-orange text-white md:right-[16%]"
          initial={{ opacity: 0, scale: 0.4, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18, delay: 1.35 }}
        >
          {last.tag}
        </motion.span>
      )}
    </div>
  );
}
