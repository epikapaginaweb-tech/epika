import { RevealGroup, RevealItem } from "../motion/Reveal";
import { Odometer } from "../motion/Odometer";
import { Spotlight } from "../motion/Spotlight";
import type { Stat } from "@/lib/types";

export function Stats({ stats, tone = "light" }: { stats: Stat[]; tone?: "light" | "dark" }) {
  if (stats.length === 0) return null;
  const dark = tone === "dark";
  const cols = stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "md:grid-cols-3" : "";

  return (
    <RevealGroup className={`grid grid-cols-2 gap-3 md:gap-4 ${cols}`}>
      {stats.map((stat, i) => (
        <RevealItem key={`${stat.label}-${i}`}>
          <Spotlight
            className={`group h-full overflow-hidden rounded-[var(--radius-card)] p-5 transition-transform md:p-7 duration-500 hover:-translate-y-1.5 ${
              dark ? "bg-white/5 text-white ring-1 ring-white/10" : "bg-white text-navy"
            }`}
          >
            <p className="text-4xl font-extrabold tracking-tight md:text-6xl">
              <Odometer value={Number(stat.value) || 0} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className={`mt-4 text-sm font-medium ${dark ? "text-white/65" : "text-ink/60"}`}>{stat.label}</p>
            <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-orange transition-all duration-700 group-hover:w-full" />
          </Spotlight>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
