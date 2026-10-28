"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RevealText } from "../motion/RevealText";
import { CatalogCard, type CatalogCardData } from "./CatalogCard";
import { Sticker } from "./Sticker";

type Filter = { key: string; label: string };

const HEADINGS: Record<string, { accent: string; text: string }> = {
  todos: { accent: "programas", text: "Sé parte de la experiencia Épika. Regístrate hoy, asegura tu lugar y lleva tus habilidades al siguiente nivel." },
  programa: { accent: "programas", text: "Sé parte de la experiencia Épika. Regístrate hoy, asegura tu lugar y lleva tus habilidades al siguiente nivel." },
  seminario: { accent: "seminarios", text: "Potencia tus habilidades, conecta y aprende." },
  otro: { accent: "talleres", text: "Experiencias especiales para completar tu perfil." },
};

type Props = {
  courses: CatalogCardData[];
  filters: Filter[];
  showComingSoon: boolean;
  slogan: string;
};

export function CatalogView({ courses, filters, showComingSoon, slogan }: Props) {
  const initial = useSearchParams().get("categoria");
  const [active, setActive] = useState(initial && filters.some((f) => f.key === initial) ? initial : "todos");
  const inCategory = active === "todos" ? courses : courses.filter((c) => c.categoryKey === active);
  const open = inCategory.filter((c) => !c.comingSoon);
  const soon = showComingSoon ? inCategory.filter((c) => c.comingSoon) : [];
  const heading = HEADINGS[active] ?? HEADINGS.todos;
  const options = [{ key: "todos", label: "Todos" }, ...filters];

  return (
    <>
      <div className="relative mx-auto max-w-3xl text-center">
        <RevealText key={active} as="h1" text="Nuestros" accent={heading.accent} accentFont="script" className="bolder text-5xl font-bold leading-none md:text-6xl" />
        <Sticker name="compu" size={72} rotate={8} className="absolute right-0 top-0 hidden sm:block md:-right-6" />
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/65">{heading.text}</p>
      </div>

      {filters.length > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar por categoría">
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
                <motion.span layoutId="catalog-filter" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {open.length === 0 && soon.length === 0 && (
        <p className="mt-10 rounded-[2rem] bg-white p-10 text-center text-ink/60">Muy pronto publicaremos programas en esta categoría.</p>
      )}

      {open.length > 0 && (
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {open.map((course) => (
              <motion.div key={course.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <CatalogCard course={course} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {soon.length > 0 && (
        <section className="mt-14">
          <div className="border-b-2 border-orange pb-2">
            <h2 className="bolder text-2xl font-bold text-navy md:text-3xl">Próximamente</h2>
          </div>
          {slogan && <p className="mt-3 text-sm text-ink/60">{slogan}</p>}
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {soon.map((course) => (
              <CatalogCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
