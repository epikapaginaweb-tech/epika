"use client";

import { useRef } from "react";

type Item = { id: string; name: string; place: string | null; quote: string };

const DOT_COLORS = ["#f07c00", "#e0003c", "#c08a4a", "#0d284f", "#34b44a", "#ff9100"];

function Card({ item, index }: { item: Item; index: number }) {
  return (
    <figure data-card className="flex w-[19rem] shrink-0 snap-start flex-col rounded-[2rem] bg-[#fbf9f6] p-7 md:w-[21rem]">
      <figcaption className="flex items-center gap-3">
        <span aria-hidden className="size-9 shrink-0 rounded-full" style={{ background: DOT_COLORS[index % DOT_COLORS.length] }} />
        <span>
          <span className="bolder block text-xl font-bold leading-tight text-black">{item.name}</span>
          {item.place && <span className="block text-sm text-ink/50">{item.place}</span>}
        </span>
      </figcaption>
      <blockquote className="mt-4 text-[0.95rem] leading-snug text-black/85">{item.quote}</blockquote>
    </figure>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Testimonio anterior" : "Testimonio siguiente"}
      className="flex size-11 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-orange"
    >
      <svg aria-hidden viewBox="0 0 24 24" className={`size-5 ${dir === "prev" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/** Carrusel manual: se mueve con las flechas (o deslizando con el dedo / la rueda del mouse). */
export function TestimonialMarquee({ items, className = "" }: { items: Item[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div
        ref={track}
        className="container-page flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <Card key={item.id} item={item} index={i} />
        ))}
      </div>
      {items.length > 1 && (
        <div className="container-page mt-6 flex justify-center gap-3">
          <Arrow dir="prev" onClick={() => move(-1)} />
          <Arrow dir="next" onClick={() => move(1)} />
        </div>
      )}
    </div>
  );
}
