import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { CourseImage } from "@/components/site/CourseImage";
import { PlanPrices } from "@/components/site/PlanPrices";
import { StickyCta } from "@/components/site/StickyCta";
import { Sticker, type StickerName } from "@/components/site/Sticker";
import { TestimonialMarquee } from "@/components/site/TestimonialMarquee";
import { CheckIcon } from "@/components/site/icons";
import { TAGS, getCourse, getSettings, getTestimonials } from "@/lib/data";
import { courseCover } from "@/lib/covers";
import { MODALITY_LABEL, formatDate, formatPrice } from "@/lib/format";
import { courseMessage, whatsappUrl } from "@/lib/whatsapp";

export async function generateMetadata({ params }: PageProps<"/programas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Programa no encontrado" };
  const description = course.short_description ?? course.summary ?? undefined;
  return {
    title: course.title,
    description,
    alternates: { canonical: `/programas/${course.slug}` },
    openGraph: {
      title: course.title,
      description,
      images: course.banner_url || course.image_url ? [{ url: (course.banner_url || course.image_url)!, alt: course.title }] : undefined,
    },
  };
}

const KIND_LABEL: Record<string, string> = { programa: "Programa", seminario: "Seminario", otro: "Taller" };
const DEFAULT_CASH = "Es un solo pago: cancelas el valor total por transferencia y tu cupo queda asegurado. ¡Así de simple!";
const DEFAULT_CREDIT = "Épika te da un plan acumulativo: vas abonando a tu programa en cuotas, a tu ritmo, hasta completar el valor. Escríbenos y lo armamos contigo.";

function Heading({ text, accent }: { text: string; accent: string }) {
  return <RevealText text={text} accent={accent} accentFont="script" className="bolder text-4xl font-bold leading-none md:text-5xl" />;
}

async function CourseView({ slug }: { slug: string }) {
  "use cache";
  cacheTag(TAGS.courses, TAGS.teachers, TAGS.settings, TAGS.testimonials);
  cacheLife("hours");

  const [course, settings, testimonials] = await Promise.all([getCourse(slug), getSettings(), getTestimonials()]);
  if (!course) notFound();

  const price = formatPrice(course.price, course.currency);
  const credit = formatPrice(course.price_credit, course.currency);
  const dateFormat: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  const start = formatDate(course.start_date, dateFormat);
  const kind = course.category ?? "programa";
  const label = `${KIND_LABEL[kind] ?? "Programa"} ${course.modality === "virtual" ? "100% Virtual" : MODALITY_LABEL[course.modality]}`;
  const advisor = whatsappUrl(settings.salesWhatsapp || settings.whatsapp, courseMessage(course.title), settings.countryCode);
  const enrollHref = `/inscripcion?curso=${encodeURIComponent(course.slug)}`;
  const soon = course.coming_soon;
  const teacher = course.teacher;
  const brochure = course.brief_public && course.brief_url;
  const cover = courseCover(course);
  const certificateLabel = course.certificate?.split("\n")[0]?.trim() || null;
  const own = testimonials.filter((t) => t.course_id === course.id);
  // Si el programa aún no tiene testimonios propios, mostramos los generales para que la sección no quede vacía.
  const courseTestimonials = own.length > 0 ? own : testimonials.filter((t) => !t.course_id);

  const plans = [
    price && { label: "Plan Contado", price, note: course.cash_note || DEFAULT_CASH },
    credit && { label: "Plan Crédito", price: credit, note: course.credit_note || DEFAULT_CREDIT },
  ].filter(Boolean) as { label: string; price: string; note: string }[];

  const highlights: { icon?: StickerName; big?: string; label: string }[] = [
    { icon: "envivo", label: "Clases en vivo" },
    ...(course.academic_hours ? [{ big: String(course.academic_hours), label: "Horas Académicas" }] : []),
    ...(certificateLabel ? [{ icon: "certificado" as StickerName, label: certificateLabel }] : []),
    { icon: "compu", label: "Campus Virtual" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.short_description ?? course.summary ?? course.title,
    provider: { "@type": "Organization", name: "Épika Academy" },
    ...(course.image_url && { image: course.image_url }),
    ...(price && course.price !== null && {
      offers: { "@type": "Offer", price: course.price, priceCurrency: course.currency, category: "Paid" },
    }),
  };

  return (
    <>
      {!soon && <StickyCta href={enrollHref} title={course.title} price={price} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Portada del curso */}
      <section data-dark-hero>
        {/* Igual que el moodboard: imagen completa de borde a borde (pasa por detrás del menú), título y brochure arriba a la izquierda, fechas abajo a la derecha. */}
        <div className="relative isolate -mt-18 overflow-hidden rounded-b-[2.5rem] bg-[#140a2e] text-white">
          {course.banner_url ? (
            // Imagen horizontal del panel: ocupa todo el banner.
            <div className="absolute inset-0 -z-10">
              <CourseImage src={course.banner_url} title={course.title} sizes="100vw" eager label="" seed={course.title} />
            </div>
          ) : (
            cover && (
              <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[70%] [mask-image:linear-gradient(to_right,transparent,black_28%)]">
                <Image src={cover} alt={`Portada del brochure de ${course.title}`} fill sizes="(min-width: 768px) 70vw, 100vw" priority className="object-cover object-[center_62%]" />
              </div>
            )
          )}
          <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#140a2e] via-[#140a2e]/55 to-transparent" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
          <span aria-hidden className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/50 to-transparent" />

          <div className="container-page relative flex min-h-[30rem] flex-col justify-center pb-24 pt-28 text-left md:min-h-[36rem] md:pb-24 md:pt-32">
          <div className="max-w-xl">
            <Link href="/programas" className="text-xs font-semibold text-white/60 hover:text-white">
              ← Todos los programas
            </Link>
            <p className="mt-6 text-sm text-white/85">{label}</p>
            <h1 className="bolder mt-1 text-4xl font-bold leading-[0.98] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] md:text-6xl">{course.title}</h1>
            {brochure && (
              <div className="mt-6">
                <p className="text-xs text-white/70">Descargar</p>
                <a href={brochure} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block rounded-full bg-orange px-5 py-1.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
                  Brochure
                </a>
              </div>
            )}
          </div>

          {start && (
            <div className="absolute bottom-10 right-4 text-right [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] sm:right-6 md:bottom-12 md:right-8">
              <p className="text-sm text-white/85">Inicio de clases</p>
              <p className="bolder text-3xl font-bold capitalize md:text-4xl">{start.replace(/\./g, "")}</p>
            </div>
          )}
          </div>
        </div>

        <div className="container-page mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {soon ? (
            <span className="rounded-full bg-orange-soft px-7 py-3 text-sm font-bold text-[#b35f00]">Próximamente</span>
          ) : (
            <Link href={enrollHref} className="rounded-full bg-navy px-8 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
              Inscríbete
            </Link>
          )}
          <a href={advisor} target="_blank" rel="noopener noreferrer" className="rounded-full bg-go px-8 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
            Habla con un asesor
          </a>
        </div>
      </section>

      {/* Acerca del programa + planes */}
      <section className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <Heading text="Acerca del" accent={kind === "seminario" ? "seminario" : "programa"} />
          {(course.summary || course.short_description) && (
            <Reveal>
              <p className="mt-6 whitespace-pre-line text-justify text-base leading-relaxed text-ink/75">{course.summary ?? course.short_description}</p>
            </Reveal>
          )}
          {course.audience && (
            <Reveal>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink/75">
                <span className="font-bold text-ink">Dirigido a: </span>
                {course.audience}
              </p>
            </Reveal>
          )}
          {course.schedule && (
            <p className="mt-4 text-sm text-ink/60">
              <span className="font-bold text-ink">Horario: </span>
              {course.schedule}
              {course.duration && ` · ${course.duration}`}
            </p>
          )}
        </div>
      </section>

      {/* Lo que incluye */}
      <section className="container-page">
        <div className="mx-auto max-w-4xl">
        <RevealGroup className="grid grid-cols-2 gap-6 rounded-[2rem] bg-white px-6 py-8 md:grid-cols-4">
          {highlights.map((item) => (
            <RevealItem key={item.label}>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-24 items-center justify-center">
                  {item.icon ? (
                    <Sticker name={item.icon} size={168} float={false} />
                  ) : (
                    <span className="font-display text-6xl leading-none text-navy">{item.big}</span>
                  )}
                </span>
                <p className="bolder mt-2 max-w-[9rem] text-balance text-base font-bold leading-tight text-navy">{item.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        </div>
      </section>

      {/* Planes de pago (debajo de los iconos, centrados). Al pasar el cursor explica cada uno. */}
      {plans.length > 0 && (
        <section className="container-page pt-12 md:pt-14">
          <PlanPrices plans={plans} className="justify-center" />
        </section>
      )}

      {/* Lo que aprenderás */}
      {course.objectives.length > 0 && (
        <section className="container-page py-12 md:py-16">
          <Heading text="Lo que" accent="aprenderás" />
          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {course.objectives.map((objective) => (
              <RevealItem key={objective}>
                <div className="flex h-full items-center gap-3 rounded-2xl bg-white p-5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange">
                    <CheckIcon />
                  </span>
                  <p className="text-sm font-semibold leading-snug text-navy">{objective}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* Módulos */}
      {course.modules.length > 0 && (
        <section className="container-page py-6 md:py-8">
          <Heading text={kind === "seminario" ? "Sesiones del" : "Módulos del"} accent={kind === "seminario" ? "seminario" : "programa"} />
          <ol className="mt-8 divide-y divide-line overflow-hidden rounded-[2rem] bg-white">
            {course.modules.map((mod, i) => (
              <li key={`${mod.title}-${i}`}>
                <details className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center gap-5">
                    <span className="text-sm font-bold tabular-nums text-orange">{kind === "seminario" ? "Sesión" : "Módulo"} {i + 1}</span>
                    <span className="flex-1 font-semibold text-navy">{mod.title}</span>
                    {mod.description && (
                      <span aria-hidden className="text-xl text-ink/40 transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    )}
                  </summary>
                  {mod.description && <p className="mt-3 whitespace-pre-line pl-[5.5rem] text-sm leading-relaxed text-ink/65">{mod.description}</p>}
                </details>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Ponente */}
      {teacher && (
        <section className="container-page py-12 md:py-16">
          <h2 className="bolder text-4xl font-bold text-navy md:text-5xl">Ponente</h2>
          <div className="mt-8 grid items-start gap-8 md:grid-cols-[0.35fr_1fr]">
            <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-[2rem] bg-navy">
              {teacher.photo_url ? (
                <Image src={teacher.photo_url} alt={teacher.name} fill sizes="(min-width: 768px) 25vw, 80vw" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-6xl font-bold text-white/30">{teacher.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="bolder text-2xl font-bold text-navy">{teacher.name}</p>
              {teacher.headline && <p className="mt-1 text-sm font-semibold text-orange">{teacher.headline}</p>}
              {teacher.bio && <p className="mt-4 whitespace-pre-line text-justify text-sm leading-relaxed text-ink/75">{teacher.bio}</p>}
            </div>
          </div>
        </section>
      )}

      {/* Testimonios de este programa */}
      {courseTestimonials.length > 0 && (
        <section className="py-12 md:py-16">
          <h2 className="bolder text-center text-4xl font-bold text-navy md:text-5xl">Testimonios</h2>
          <TestimonialMarquee className="mt-8" items={courseTestimonials.map((t) => ({ id: t.id, name: t.name, place: t.course, quote: t.quote }))} />
        </section>
      )}

    </>
  );
}

async function CourseFromParams({ params }: { params: PageProps<"/programas/[slug]">["params"] }) {
  const { slug } = await params;
  return <CourseView slug={slug} />;
}

function CourseSkeleton() {
  return (
    <div className="container-page grid gap-12 pb-16 pt-16 md:grid-cols-2" aria-busy>
      <div className="space-y-5">
        <div className="h-6 w-24 animate-pulse rounded-full bg-line" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-line" />
        <div className="h-24 w-4/5 animate-pulse rounded-2xl bg-line" />
      </div>
      <div className="aspect-[4/5] w-full max-w-md animate-pulse rounded-[2rem] bg-line" />
    </div>
  );
}

export default function CoursePage({ params }: PageProps<"/programas/[slug]">) {
  return (
    <Suspense fallback={<CourseSkeleton />}>
      <CourseFromParams params={params} />
    </Suspense>
  );
}
