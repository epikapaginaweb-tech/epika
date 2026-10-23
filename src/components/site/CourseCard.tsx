"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { CourseImage } from "./CourseImage";

export type CourseCardData = {
  slug: string;
  title: string;
  image: string | null;
  modality: string;
  description: string | null;
  meta: string[];
};

export function CourseCard({ course, index = 0 }: { course: CourseCardData; index?: number }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });

  function onMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.article
      className="group [perspective:1200px]"
      initial={{ opacity: 0, y: 60, rotate: index % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 70, damping: 16, delay: (index % 3) * 0.08 }}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col rounded-[var(--radius-card)] bg-white p-2.5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-35px_rgba(0,41,82,0.35)] transition-shadow duration-500 group-hover:shadow-[0_40px_80px_-35px_rgba(0,41,82,0.5)]"
      >
        <div className="shine relative aspect-[4/3.4] overflow-hidden rounded-[1.35rem]">
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <CourseImage src={course.image} title={course.title} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          </div>
          <span className="bubble absolute left-4 top-4 bg-white/95 text-navy shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-orange" />
            {course.modality}
          </span>
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <h3 className="text-xl font-bold leading-snug tracking-tight text-navy">{course.title}</h3>
          {course.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/65">{course.description}</p>}
          {course.meta.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {course.meta.map((item) => (
                <li key={item} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink/70">
                  {item}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto pt-6">
            <Link
              href={`/programas/${course.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange after:absolute after:inset-0 after:rounded-[var(--radius-card)]"
            >
              Ver información
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
