import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { WhatsAppLink } from "@/components/site/Buttons";
import { CourseImage } from "@/components/site/CourseImage";
import { CoverArt } from "@/components/site/CoverArt";
import { PricingFan, type PriceCard } from "@/components/site/PricingFan";
import { StickyCta } from "@/components/site/StickyCta";
import { CheckIcon } from "@/components/site/icons";
import { TAGS, getCourse, getSettings } from "@/lib/data";
import { MODALITY_LABEL, formatDate, formatPrice } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/types";
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
      images: course.image_url ? [{ url: course.image_url, alt: course.title }] : undefined,
    },
  };
}

function Fact({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl bg-white px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink/45">{label}</dt>
      <dd className="mt-1 font-semibold text-navy">{value}</dd>
    </div>
  );
}

function Block({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-line py-14 md:grid-cols-[0.75fr_1.25fr] md:py-20">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <RevealText text={title} className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl" />
      </div>
      <Reveal>{children}</Reveal>
    </section>
  );
}

async function CourseView({ slug }: { slug: string }) {
  "use cache";
  cacheTag(TAGS.courses, TAGS.teachers, TAGS.settings);
  cacheLife("hours");

  const [course, settings] = await Promise.all([getCourse(slug), getSettings()]);
  if (!course) notFound();

  const price = formatPrice(course.price, course.currency);
  const start = formatDate(course.start_date);
  const modality = MODALITY_LABEL[course.modality];
  const whatsapp = whatsappUrl(settings.whatsapp, courseMessage(course.title), settings.countryCode);
  const advisor = whatsappUrl(settings.salesWhatsapp || settings.whatsapp, courseMessage(course.title), settings.countryCode);
  const reserveHref = `/reservar?curso=${encodeURIComponent(course.slug)}`;
  const teacher = course.teacher;

  const pricing: PriceCard[] = [
    { label: "Formas de pago", title: course.payment_methods.length ? "Opciones" : "Consúltanos", items: course.payment_methods },
    { label: "Inversión", title: price ?? "Por confirmar", items: [modality, start && `Inicia ${start}`, course.duration].filter(Boolean) as string[], highlight: true },
    { label: "Incluye", title: course.includes.length ? "Lo que recibes" : "Consúltanos", items: course.includes },
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
      <StickyCta href={reserveHref} title={course.title} price={price} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="container-page grid items-center gap-12 pb-16 pt-10 md:grid-cols-[1fr_1fr] md:pt-16">
        <div>
          <Reveal y={12}>
            <Link href="/programas" className="text-sm font-medium text-ink/50 transition-colors hover:text-orange">
              ← Todos los programas
            </Link>
          </Reveal>
          <Reveal y={12} delay={0.05} className="mt-6 flex flex-wrap gap-2">
            <span className="bubble bg-orange text-white">{CATEGORY_LABEL[course.category ?? "programa"]}</span>
            <span className="bubble bg-navy text-white">{modality}</span>
          </Reveal>
          <RevealText as="h1" text={course.title.toUpperCase()} className="mt-5 text-4xl font-bold leading-[0.98] md:text-6xl" />
          {course.brief_url && course.brief_public && (
            <Reveal delay={0.15} className="mt-7">
              <a
                href={course.brief_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-brochure px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Descargar Brochure
              </a>
            </Reveal>
          )}
          {(course.summary || course.short_description) && (
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-xl whitespace-pre-line text-base font-semibold leading-relaxed text-ink md:text-lg">
                {course.summary ?? course.short_description}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={reserveHref}
                className="rounded-full bg-dark px-9 py-3.5 text-center text-base font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Comprar
              </Link>
              <a
                href={advisor}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-go px-9 py-3.5 text-center text-base font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Contactar con un asesor
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact label="Inicio" value={start} />
              <Fact label="Duración" value={course.duration} />
              <Fact label="Horario" value={course.schedule} />
              <Fact label="Inversión" value={price} />
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={60}>
          <div className="shine relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2rem] bg-white shadow-[0_50px_90px_-50px_rgba(13,40,79,0.55)] ring-1 ring-ink/80">
            <ImageReveal className="absolute inset-0">
              <CourseImage src={course.image_url} title={course.title} sizes="(min-width: 768px) 45vw, 100vw" eager label={course.title} />
            </ImageReveal>
          </div>
        </Reveal>
      </section>

      <div className="container-page">
        {course.objectives.length > 0 && (
          <Block eyebrow="Objetivos" title="Lo que vas a lograr">
            <RevealGroup className="grid gap-3 sm:grid-cols-2">
              {course.objectives.map((objective) => (
                <RevealItem key={objective}>
                  <div className="flex h-full gap-3 rounded-2xl bg-white p-5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange">
                      <CheckIcon />
                    </span>
                    <p className="text-sm leading-relaxed text-ink/75">{objective}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </Block>
        )}

        {(course.audience || course.requirements.length > 0) && (
          <Block eyebrow="Perfil" title="¿A quién va dirigido?">
            <div className="grid gap-4 sm:grid-cols-2">
              {course.audience && (
                <div className="rounded-[var(--radius-card)] bg-navy p-7 text-white">
                  <p className="eyebrow !text-orange">Dirigido a</p>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-white/85">{course.audience}</p>
                </div>
              )}
              {course.requirements.length > 0 && (
                <div className="rounded-[var(--radius-card)] bg-white p-7">
                  <p className="eyebrow">Requisitos</p>
                  <ul className="mt-3 space-y-2 text-ink/75">
                    {course.requirements.map((req) => (
                      <li key={req} className="flex gap-2">
                        <span aria-hidden className="text-orange">●</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Block>
        )}

        {course.modules.length > 0 && (
          <Block eyebrow="Temario" title="Módulos del programa">
            <ol className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] bg-white">
              {course.modules.map((mod, i) => (
                <li key={`${mod.title}-${i}`}>
                  <details className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center gap-5">
                      <span className="text-sm font-bold tabular-nums text-orange">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 font-semibold text-navy">{mod.title}</span>
                      {mod.description && (
                        <span aria-hidden className="text-xl text-ink/40 transition-transform duration-300 group-open:rotate-45">
                          +
                        </span>
                      )}
                    </summary>
                    {mod.description && <p className="mt-3 whitespace-pre-line pl-10 text-sm leading-relaxed text-ink/65">{mod.description}</p>}
                  </details>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {teacher && (
          <Block eyebrow="Instructor" title="Quién te acompaña">
            <div className="flex flex-col gap-6 rounded-[var(--radius-card)] bg-white p-6 sm:flex-row sm:items-center">
              <div className="relative size-32 shrink-0 overflow-hidden rounded-3xl">
                {teacher.photo_url ? (
                  <Image src={teacher.photo_url} alt={teacher.name} fill sizes="128px" className="object-cover" />
                ) : (
                  <CoverArt seed={teacher.name} />
                )}
              </div>
              <div>
                <p className="text-xl font-bold text-navy">{teacher.name}</p>
                {teacher.headline && <p className="text-sm font-medium text-orange">{teacher.headline}</p>}
                {teacher.bio && <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink/65">{teacher.bio}</p>}
                <Link href="/instructores" className="mt-3 inline-block text-sm font-semibold text-navy font-script text-[1.3em] hover:text-orange">
                  Ver perfil completo
                </Link>
              </div>
            </div>
          </Block>
        )}

        <section className="border-t border-line py-14 md:py-24">
          <div className="text-center">
            <p className="eyebrow">Inversión</p>
            <RevealText text="Precio, pagos" accent="y lo que incluye." className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" />
          </div>
          <div className="mx-auto mt-14 max-w-5xl">
            <PricingFan cards={pricing} />
          </div>
        </section>

        {(course.certificate || (course.brief_public && course.brief_url)) && (
          <Block eyebrow="Certificación" title="Al finalizar">
            <div className="rounded-[var(--radius-card)] bg-white p-7">
              {course.certificate && <p className="whitespace-pre-line leading-relaxed text-ink/75">{course.certificate}</p>}
              {course.brief_public && course.brief_url && (
                <a
                  href={course.brief_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-orange hover:text-white"
                >
                  Descargar brief del programa ↓
                </a>
              )}
            </div>
          </Block>
        )}

        <Reveal>
          <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-navy p-8 text-white md:flex-row md:items-center md:p-12">
            <div>
              <p className="text-2xl font-bold tracking-tight md:text-3xl">¿Te interesa {course.title}?</p>
              <p className="mt-2 text-white/65">Solicita tu reserva y te confirmamos disponibilidad.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={reserveHref}
                className="rounded-full bg-orange px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
              >
                Solicitar reserva
              </Link>
              <WhatsAppLink href={whatsapp} tone="dark">
                Consultar por WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </Reveal>
      </div>
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
