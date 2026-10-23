import { useSyncExternalStore } from "react";
import { translate } from "./dictionary";

export type Lang = "es" | "en";

const KEY = "epika-lang";
let lang: Lang = "es";
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

function apply(next: Lang) {
  lang = next;
  document.documentElement.lang = next;
  emit();
}

/** Lee el idioma guardado (solo en el navegador, después de hidratar). */
export function initLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "es") apply(saved);
  } catch {
    /* sin almacenamiento: se queda en español */
  }
}

export function setLang(next: Lang) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* ignorar */
  }
  apply(next);
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, () => lang, () => "es" as Lang);
}

/** Devuelve una función que traduce textos cuando el idioma activo es inglés. */
export function useT() {
  const current = useLang();
  return (value: string) => (current === "en" ? translate(value) : value);
}
