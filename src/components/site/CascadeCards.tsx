"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CourseImage } from "./CourseImage";

export type CascadeItem = { key: string; title: string; image: string | null; tag: string; href: string; seed?: string };

export function CascadeCards({ items }: { items: CascadeItem[] }) {
  return (
    <div className="relative h-[24rem] w-full sm:h-[26rem]">
      {items.map((item, i) => (
        <motion.div
          key={item.key}
          className="absolute"
          style={{ left: `${i * (78 / Math.max(items.length - 1, 1))}%`, top: `${8 + i * 7}%`, zIndex: i }}
          initial={{ opacity: 0, x: 140, y: 40, rotate: 12 }}
          whileInView={{ opacity: 1, x: 0, y: 0, rotate: i % 2 ? 4 : -4 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.1 }}
          whileHover={{ y: -18, rotate: 0, zIndex: 40, scale: 1.04 }}
        >
          <Link
            href={item.href}
            className="shine relative block h-48 w-36 overflow-hidden rounded-[1.25rem] bg-white shadow-[0_24px_50px_-24px_rgba(0,41,82,0.5)] ring-4 ring-white sm:h-60 sm:w-44"
          >
            <CourseImage src={item.image} title={item.title} sizes="180px" label={item.title} seed={item.seed} />
          </Link>
          {i === items.length - 1 || i === 0 ? (
            <span className={`bubble absolute -top-4 left-3 ${i === 0 ? "bg-orange text-white" : "bg-navy text-white"}`}>{item.tag}</span>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
