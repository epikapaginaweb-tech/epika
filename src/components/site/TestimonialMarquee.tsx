type Item = { id: string; name: string; place: string | null; quote: string };

const DOT_COLORS = ["#f07c00", "#e0003c", "#c08a4a", "#0d284f", "#34b44a", "#ff9100"];

function Card({ item, index }: { item: Item; index: number }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-[2rem] bg-[#fbf9f6] p-7 md:w-[21rem]">
      <figcaption className="flex items-center gap-3">
        <span aria-hidden className="size-9 shrink-0 rounded-full" style={{ background: DOT_COLORS[index % DOT_COLORS.length] }} />
        <span>
          <span className="bolder block text-lg font-bold leading-tight text-ink">{item.name}</span>
          {item.place && <span className="block text-sm text-ink/50">{item.place}</span>}
        </span>
      </figcaption>
      <blockquote className="mt-4 text-sm leading-relaxed text-ink/80">{item.quote}</blockquote>
    </figure>
  );
}

/** Carrusel lento e infinito que avanza de derecha a izquierda; se pausa al pasar el cursor. */
export function TestimonialMarquee({ items, className = "" }: { items: Item[]; className?: string }) {
  if (items.length === 0) return null;
  // Repetimos la lista para que la banda siempre cubra la pantalla aunque haya pocos testimonios.
  const base: Item[] = [];
  while (base.length < 8) base.push(...items);
  const duration = `${base.length * 9}s`;

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-5" aria-hidden={copy === 1 || undefined}>
            {base.map((item, i) => (
              <Card key={`${copy}-${item.id}-${i}`} item={item} index={i % items.length} />
            ))}
          </div>
        ))}
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
