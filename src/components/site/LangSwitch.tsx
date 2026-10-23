"use client";

import { setLang, useLang, type Lang } from "@/lib/i18n/store";

const OPTIONS: { value: Lang; label: string; name: string }[] = [
  { value: "es", label: "ES", name: "Español" },
  { value: "en", label: "EN", name: "English" },
];

/** Selector ES | EN. `tone="dark"` es para fondos azules (pie de página). */
export function LangSwitch({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const lang = useLang();
  const dark = tone === "dark";

  return (
    <div
      role="group"
      aria-label="Cambiar idioma"
      data-no-translate
      className={`inline-flex items-center rounded-full p-0.5 text-xs font-bold ${dark ? "border border-white/25" : "bg-white shadow-sm ring-1 ring-navy/10"} ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            lang={option.value}
            title={option.name}
            aria-pressed={active}
            onClick={() => setLang(option.value)}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active ? "bg-orange text-white" : dark ? "text-white/70 hover:text-white" : "text-navy/60 hover:text-navy"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
