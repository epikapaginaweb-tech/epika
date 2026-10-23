"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CourseCard, type CourseCardData } from "./CourseCard";

type Item = CourseCardData & { categoryKey: string };

export function CourseGrid({ courses, filters }: { courses: Item[]; filters: { key: string; label: string }[] }) {
  const initial = useSearchParams().get("categoria");
  const [active, setActive] = useState(initial && filters.some((f) => f.key === initial) ? initial : "todos");
  const visible = active === "todos" ? courses : courses.filter((c) => c.categoryKey === active);
  const options = [{ key: "todos", label: "Todos" }, ...filters];

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setActive(option.key)}
            aria-pressed={active === option.key}
            className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              active === option.key ? "text-white" : "bg-white text-navy hover:text-orange"
            }`}
          >
            {active === option.key && (
              <motion.span layoutId="course-filter" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className="relative">{option.label}</span>
          </button>
        ))}
      </div>
      {visible.length === 0 && <p className="rounded-[2rem] bg-white p-10 text-ink/60">Muy pronto publicaremos programas en esta categoría.</p>}
      <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((course, i) => (
            <motion.div
              key={course.slug}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35 }}
            >
              <CourseCard course={course} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
