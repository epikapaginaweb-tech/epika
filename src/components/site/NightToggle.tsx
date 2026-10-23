"use client";

import { useEffect } from "react";
import { initTheme, setTheme, useTheme } from "@/lib/theme";

/** Botón del pie de página: pasa todo el sitio a azul profundo con partículas. */
export function NightToggle() {
  const theme = useTheme();
  const night = theme === "night";

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <button
      type="button"
      onClick={() => setTheme(night ? "light" : "night")}
      aria-pressed={night}
      className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-orange hover:text-orange"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {night ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
      {night ? "Modo claro" : "Modo azul"}
    </button>
  );
}
