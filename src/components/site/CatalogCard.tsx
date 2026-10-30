import Image from "next/image";
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
  dates: string | null;
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

/** Logo del aval (El Nuevo Ecuador · Ministerio del Trabajo); se activa/desactiva por programa en el panel. */
function EcuadorBadge() {
  return (
    <span className="inline-flex items-center" title="Con el aval del Ministerio del Trabajo">
      <Image src="/brand/aval-ecuador.png" alt="Aval: El Nuevo Ecuador, Ministerio del Trabajo" width={475} height={74} className="logo-day h-[0.95rem] w-auto" />
      <Image src="/brand/aval-ecuador-light.png" alt="" width={475} height={74} className="logo-night h-[0.95rem] w-auto" />
    </span>
  );
}

/** Tarjeta modular del catálogo. «Más información» abre la página del programa en la misma pestaña. */
export function CatalogCard({ course }: { course: CatalogCardData }) {
  const href = `/programas/${course.slug}`;
  const unit = course.categoryKey === "seminario" ? ["sesión", "sesiones"] : ["Módulo", "Módulos"];
  const facts = [course.modules > 0 && `${course.modules} ${course.modules === 1 ? unit[0] : unit[1]}`, course.duration].filter(Boolean) as string[];

  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem] bg-navy">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <CourseImage src={course.image} title={course.title} sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" seed={course.title} label={course.title} className="object-[center_28%]" />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-wider text-orange">{course.categoryLabel}</p>
        <h3 className="bolder mt-1 line-clamp-2 text-lg font-bold leading-snug text-navy">{course.title}</h3>
        <div className="mt-1.5">
          <Stars value={course.rating} />
        </div>
        {course.dates && <p className="mt-2 text-xs font-semibold capitalize text-navy/70">{course.dates}</p>}
        {facts.length > 0 && (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-ink/55">
            {facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          {course.showEcuador ? <EcuadorBadge /> : <span />}
          {!course.comingSoon && (
            <Link
              href={href}
              className="shrink-0 whitespace-nowrap rounded-full bg-navy px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-orange"
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
      <article className="relative flex h-full flex-col rounded-[1.6rem] bg-white p-2.5 shadow-[0_24px_50px_-35px_rgba(13,40,79,0.45)] transition-transform duration-300 ease-out hover:scale-[1.03]">
        <div aria-hidden className="pointer-events-none flex flex-1 select-none flex-col opacity-60 blur-[2px]">
          {body}
        </div>
        <Link
          href={href}
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange px-4 py-1.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105"
          aria-label={`${course.title}: próximamente`}
        >
          Próximamente
        </Link>
      </article>
    );
  }

  return <article className="group flex h-full flex-col rounded-[1.6rem] bg-white p-2.5 shadow-[0_24px_50px_-35px_rgba(13,40,79,0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_34px_70px_-35px_rgba(13,40,79,0.6)]">{body}</article>;
}
