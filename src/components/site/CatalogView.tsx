"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RevealText } from "../motion/RevealText";
import { CatalogCard, type CatalogCardData } from "./CatalogCard";

type Filter = { key: string; label: string };

// Estructura acordada: «Nuestros programas» con la cursiva pegada; Seminarios y Otros con título y subtítulo en dos líneas.
type Heading = { title: string; script?: string; line1?: string; line2?: string; text?: string };
const HEADINGS: Record<string, Heading> = {
  todos: { title: "Nuestros", script: "programas", text: "Sé parte de la experiencia Épika\nRegístrate hoy, asegura tu lugar y lleva tus habilidades al siguiente nivel." },
  programa: { title: "Nuestros", script: "programas", text: "Sé parte de la experiencia Épika\nRegístrate hoy, asegura tu lugar y lleva tus habilidades al siguiente nivel." },
  seminario: { title: "Seminarios", line1: "Potencia tus habilidades", line2: "conecta y aprende" },
  otro: { title: "Otros", line1: "Experiencias especiales", line2: "para completar tu perfil" },
};

/** Tarjetas fantasma para «Próximamente» cuando una categoría todavía no tiene programas anunciados. */
function GhostCard() {
  return (
    <div aria-hidden className="flex h-full flex-col rounded-[1.6rem] bg-white p-2.5 opacity-60 shadow-[0_24px_50px_-35px_rgba(13,40,79,0.45)] blur-[2px]">
      <div className="aspect-[16/10] rounded-[1.15rem] bg-gradient-to-br from-[#2b2257] to-[#5b2ca0]" />
      <div className="space-y-2 px-2 pb-3 pt-4">
        <div className="h-3 w-1/3 rounded-full bg-orange/40" />
        <div className="h-4 w-3/4 rounded-full bg-navy/30" />
        <div className="h-3 w-1/2 rounded-full bg-ink/15" />
        <div className="mt-4 flex justify-end">
          <div className="h-7 w-28 rounded-full bg-navy/25" />
        </div>
      </div>
    </div>
  );
}

type Props = {
  courses: CatalogCardData[];
  filters: Filter[];
  showComingSoon: boolean;
  slogan: string;
};

export function CatalogView({ courses, filters, showComingSoon, slogan }: Props) {
  const param = useSearchParams().get("categoria");
  const fromUrl = param && filters.some((f) => f.key === param) ? param : "todos";
  const [picked, setPicked] = useState<{ key: string; url: string } | null>(null);
  // La categoría sale de la dirección (?categoria=seminario). Así, al entrar desde «Oferta académica»
  // siempre se ve la categoría correcta, aunque la página Programas ya estuviera abierta antes.
  const active = picked && picked.url === fromUrl ? picked.key : fromUrl;
  const setActive = (key: string) => setPicked({ key, url: fromUrl });
  const inCategory = active === "todos" ? courses : courses.filter((c) => c.categoryKey === active);
  const open = inCategory.filter((c) => !c.comingSoon);
  const soon = showComingSoon ? inCategory.filter((c) => c.comingSoon) : [];
  // La sección «Próximamente» se muestra siempre que esté activa en el panel; si no hay programas anunciados, con tarjetas fantasma.
  const showSoonSection = showComingSoon;
  const heading = HEADINGS[active] ?? HEADINGS.todos;
  const options = [{ key: "todos", label: "Todos" }, ...filters];
  // Si llegas desde una categoría (Oferta académica), la página muestra solo esa categoría, como en el diseño.
  const fromCategory = fromUrl !== "todos";

  return (
    <>
      <div className="relative mx-auto max-w-3xl text-center">
        {heading.script ? (
          <RevealText key={active} as="h1" text={heading.title} accent={heading.script} accentFont="script" accentClassName="-mt-[0.32em]" className="bolder text-5xl font-bold leading-none md:text-6xl" />
        ) : (
          <>
            <RevealText key={active} as="h1" text={heading.title} className="bolder text-5xl font-bold leading-none md:text-6xl" />
            <p className="mt-3 text-base leading-snug text-navy md:text-lg">
              {heading.line1}
              <span className="block font-bold text-orange">{heading.line2}</span>
            </p>
          </>
        )}
        {heading.text && <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-base leading-snug text-navy">{heading.text}</p>}
      </div>

      {!fromCategory && filters.length > 1 && (
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

      {open.length === 0 && !showSoonSection && (
        <p className="mt-10 rounded-[2rem] bg-white p-10 text-center text-ink/60">Muy pronto publicaremos programas en esta categoría.</p>
      )}

      {open.length > 0 && (
        <motion.div layout className="mt-10 flex flex-wrap justify-center gap-6">
          <AnimatePresence mode="popLayout">
            {open.map((course) => (
              <motion.div key={course.slug} layout className="w-full sm:w-[17.5rem]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <CatalogCard course={course} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {showSoonSection && (
        <section className="mx-auto mt-14 max-w-[76rem]">
          <div className="border-t border-line pt-4">
            <h2 className="bolder text-2xl font-bold text-navy md:text-3xl">Próximamente</h2>
            {slogan && <p className="mt-1 text-sm text-ink/60">{slogan}</p>}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6">
            {soon.length > 0
              ? soon.map((course) => (
                  <div key={course.slug} className="w-full sm:w-[17.5rem]">
                    <CatalogCard course={course} />
                  </div>
                ))
              : Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="w-full sm:w-[17.5rem]">
                    <GhostCard />
                  </div>
                ))}
          </div>
        </section>
      )}
    </>
  );
}
