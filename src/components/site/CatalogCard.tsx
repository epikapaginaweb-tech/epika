import Link from "next/link";
import { CourseImage } from "./CourseImage";

export type CatalogCardData = {
  slug: string;
  title: string;
  image: string | null;
  categoryKey: string;
  categoryLabel: string;
  rating: number;
  modules: number;
  duration: string | null;
  showEcuador: boolean;
  comingSoon: boolean;
};

function Stars({ value }: { value: number }) {
  const full = Math.round(Math.max(0, Math.min(5, value)));
  return (
    <span className="flex items-center gap-1.5" aria-label={`${value} de 5`}>
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 20 20" className={`size-3.5 ${i < full ? "text-orange" : "text-ink/15"}`} fill="currentColor">
            <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
          </svg>
        ))}
      </span>
      <span className="text-sm font-bold text-ink">{Number.isInteger(value) ? value : value.toFixed(1)}</span>
    </span>
  );
}

/** Sello pequeño «Hecho en Ecuador» (se activa/desactiva por programa en el panel). */
function EcuadorBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-paper py-1 pl-1 pr-2.5 text-[0.62rem] font-bold uppercase leading-none tracking-wide text-navy">
      <span aria-hidden className="relative size-4 overflow-hidden rounded-full ring-1 ring-black/5">
        <span className="absolute inset-x-0 top-0 h-1/2 bg-[#ffdd00]" />
        <span className="absolute inset-x-0 top-1/2 h-1/4 bg-[#034ea2]" />
        <span className="absolute inset-x-0 bottom-0 h-1/4 bg-[#ed1c24]" />
      </span>
      Ecuador
    </span>
  );
}

/** Tarjeta modular del catálogo. «Más información» abre la página del programa en otra pestaña. */
export function CatalogCard({ course }: { course: CatalogCardData }) {
  const href = `/programas/${course.slug}`;
  const facts = [course.modules > 0 && `${course.modules} ${course.modules === 1 ? "Módulo" : "Módulos"}`, course.duration].filter(Boolean) as string[];

  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-navy">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <CourseImage src={course.image} title={course.title} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" seed={course.title} label={course.title} />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-wider text-orange">{course.categoryLabel}</p>
        <h3 className="bolder mt-1 line-clamp-2 text-lg font-bold leading-snug text-navy">{course.title}</h3>
        <div className="mt-1.5">
          <Stars value={course.rating} />
        </div>
        {facts.length > 0 && (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-ink/55">
            {facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {course.showEcuador ? <EcuadorBadge /> : <span />}
          {!course.comingSoon && (
            <Link
              href={href}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-navy px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-orange"
            >
              Más información
            </Link>
          )}
        </div>
      </div>
    </>
  );

  if (course.comingSoon) {
    return (
      <article className="relative flex h-full flex-col rounded-[1.6rem] bg-white p-2.5 shadow-[0_24px_50px_-35px_rgba(13,40,79,0.45)]">
        <div aria-hidden className="pointer-events-none flex flex-1 select-none flex-col opacity-60 blur-[2px]">
          {body}
        </div>
        <Link
          href={href}
          target="_blank"
          rel="noopener"
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
          aria-label={`${course.title}: próximamente`}
        >
          Próximamente
        </Link>
      </article>
    );
  }

  return <article className="group flex h-full flex-col rounded-[1.6rem] bg-white p-2.5 shadow-[0_24px_50px_-35px_rgba(13,40,79,0.45)] transition-shadow duration-500 hover:shadow-[0_34px_70px_-35px_rgba(13,40,79,0.6)]">{body}</article>;
}
