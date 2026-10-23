import { useSyncExternalStore } from "react";

export type Theme = "light" | "night";

const KEY = "epika-theme";
const listeners = new Set<() => void>();
let theme: Theme = "light";

function apply(next: Theme) {
  theme = next;
  if (next === "night") document.documentElement.dataset.theme = "night";
  else delete document.documentElement.dataset.theme;
  listeners.forEach((fn) => fn());
}

/** Sincroniza el estado con lo que dejó el script inline del <head>. */
export function initTheme() {
  apply(document.documentElement.dataset.theme === "night" ? "night" : "light");
}

export function setTheme(next: Theme) {
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

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, () => theme, () => "light" as Theme);
}
