import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Odometer } from "@/components/motion/Odometer";
import { ParallaxOut } from "@/components/motion/ParallaxOut";
import { ScrollText } from "@/components/motion/ScrollText";
import { PrimaryLink } from "@/components/site/Buttons";
import { HoverCloud } from "@/components/site/HoverCloud";
import { CourseFan, type FanItem } from "@/components/site/CourseFan";
import { Faq } from "@/components/site/Faq";
import { FloatingTiles } from "@/components/site/FloatingTiles";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Sticker, type StickerName } from "@/components/site/Sticker";
import { StickySteps } from "@/components/site/StickySteps";
import { toCardData } from "@/lib/course-view";
import { TAGS, getCourses, getFaqs, getSettings, getTeachers, getTestimonials } from "@/lib/data";
import type { CourseWithTeacher } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

const FAN_SIZE = 5;
const FAN_PHOTOS = ["/brand/fotos/hero-1.jpg", "/brand/fotos/hero-2.jpg", "/brand/fotos/hero-3.jpg", "/brand/fotos/hero-2.jpg", "/brand/fotos/hero-1.jpg"];
const BENEFIT_ICONS: StickerName[] = ["carita", "reloj", "compu", "paz"];
const DOT_COLORS = ["#f95d1b", "#ee1346", "#c07f2b"];

const PROGRAM_GROUPS = [
  { label: "Programas", key: "programa", image: "/brand/fotos/programas.jpg", alt: "Persona estudiando con su laptop", text: "Formación completa con instructor, módulos, certificación y acompañamiento." },
  { label: "Seminarios", key: "seminario", image: "/brand/fotos/seminarios.jpg", alt: "Persona concentrada frente a su computadora", text: "Sesiones intensivas y puntuales para aprender algo concreto en poco tiempo." },
  { label: "Otros", key: "otro", image: "/brand/fotos/otros.jpg", alt: "Persona trabajando en su escritorio", text: "Talleres, mentorías y experiencias especiales para completar tu perfil." },
];

const STEPS = [
  { title: "Elige tu programa", text: "Brochure, el instructor y la fecha de inicio." },
  { title: "Solicita tu reserva", text: "Completa el formulario en menos de un minuto." },
  { title: "Confirma tu pago", text: "Transfiere y sube tu comprobante desde el sitio." },
  { title: "Recibe tus accesos", text: "Te enviamos tu usuario y contraseña por WhatsApp para empezar." },
];

// El centro del abanico muestra el programa destacado (promoción / programa estrella).
function fanItems(courses: CourseWithTeacher[], promoLabel: string): FanItem[] {
  const center = Math.floor(FAN_SIZE / 2);
  const featured = courses.find((c) => c.featured);
  const rest = courses.filter((c) => c !== featured);
  let next = 0;

  return Array.from({ length: FAN_SIZE }, (_, i): FanItem => {
    const course = i === center ? featured : rest[next++];
    if (course) {
      const card = toCardData(course);
      return {
        info: {
          title: course.title,
          text: card.description,
          chips: [card.category, card.modality, card.price, ...card.meta].filter(Boolean) as string[],
          cta: "Ver programa",
        },
        tag: i === center ? "" : card.category,
        key: course.id,
        title: course.title,
        image: course.image_url ?? FAN_PHOTOS[i],
        href: `/programas/${course.slug}`,
        badge: i === center ? promoLabel : undefined,
      };
    }
    return {
      key: `foto-${i}`,
      title: "Épika Academy",
      image: FAN_PHOTOS[i],
      tag: "",
      href: "/programas",
      info: { title: "Épika Academy", text: "Programas virtuales con instructores especializados. Muy pronto más opciones.", cta: "Ver programas" },
    };
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const { seoDescription } = await getSettings();
  return { description: seoDescription, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  "use cache";
  cacheTag(TAGS.courses, TAGS.teachers, TAGS.faqs, TAGS.testimonials, TAGS.settings);
  cacheLife("hours");

  const [courses, teachers, faqs, testimonials, settings] = await Promise.all([
    getCourses(),
    getTeachers(),
    getFaqs(),
    getTestimonials(),
    getSettings(),
  ]);

  const help = whatsappUrl(settings.whatsapp, "Hola, quiero información sobre Épika Academy.", settings.countryCode);
  const advisor = whatsappUrl(settings.salesWhatsapp || settings.whatsapp, "Hola, quiero información sobre los programas de Épika Academy.", settings.countryCode);
  const { hero } = settings;
  const counts = courses.reduce<Record<string, number>>((acc, c) => {
    const key = c.category ?? "programa";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-white pb-20 pt-10 md:pb-28 md:pt-16">
        <ParallaxOut className="container-page relative text-center">
          <Sticker name="reloj" size={84} rotate={-10} className="absolute left-[2%] top-2 hidden md:left-[6%] md:top-6 md:block" />
          <RevealText
            as="h1"
            text={hero.title}
            accent={hero.highlight}
            delay={0.1}
            className="mx-auto max-w-2xl text-[2.9rem] font-bold leading-[0.95] sm:text-6xl md:text-7xl"
          />
          {hero.subtitle && <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">{hero.subtitle}</p>}
        </ParallaxOut>

        <div className="mt-10 md:mt-14">
          <CourseFan items={fanItems(courses, settings.promoLabel)} />
        </div>

        <div className="container-page text-center">
          <Reveal delay={3.1}>
            <a
              href={help}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-go px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(52,180,74,0.8)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              ¿En qué te podemos ayudar?
            </a>
          </Reveal>
        </div>
      </section>

      {/* Por qué Épika + cifra */}
      <section className="relative isolate overflow-hidden bg-navy py-20 text-white md:py-28">
        <div className="container-page text-center">
          <Reveal>
            <p className="text-xl font-light md:text-2xl">Porque</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight md:text-5xl">
              Aprender con nosotros <span className="font-script inline-block whitespace-nowrap text-[1.35em] font-normal text-orange">se nota</span>
            </h2>
          </Reveal>

          <RevealGroup className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {settings.benefits.slice(0, 4).map((benefit, i) => (
              <RevealItem key={benefit.title}>
                <div className="flex flex-col items-center">
                  <Sticker name={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} size={92} rotate={i % 2 ? 6 : -6} delay={i * 0.15} />
                  <h3 className="mt-5 max-w-[10rem] text-lg font-bold leading-tight md:text-xl">{benefit.title}</h3>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {settings.stats.length > 0 && (
            <div className="mt-20 flex flex-wrap items-end justify-center gap-x-16 gap-y-12 md:mt-28">
              {settings.stats.map((stat, i) => (
                <div key={`${stat.label}-${i}`}>
                  <p className="font-display text-[8rem] leading-[0.95] sm:text-[11rem] md:text-[15rem]">
                    <Odometer value={Number(stat.value) || 0} prefix={stat.prefix} suffix={stat.suffix} plain />
                  </p>
                  <p className="mt-2 text-2xl font-bold md:text-3xl">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonios */}
      {testimonials.length > 0 && (
        <section className="container-page py-24 md:py-32">
          <Reveal>
            <h2 className="text-center text-4xl font-bold text-navy md:text-5xl">Testimonios</h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 6).map((t, i) => (
              <RevealItem key={t.id}>
                <figure className="flex h-full flex-col rounded-[2rem] bg-[#fbf9f6] p-7">
                  <figcaption className="flex items-center gap-3">
                    <span aria-hidden className="size-8 shrink-0 rounded-full" style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                    <span className="font-bold text-ink">{t.name}</span>
                  </figcaption>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">{t.quote}</blockquote>
                  {t.course && <p className="mt-4 text-xs font-semibold text-ink/45">{t.course}</p>}
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* Nuestros programas */}
      <section className="container-page py-20 md:py-28">
        <Reveal className="relative text-center">
          <h2 className="text-4xl font-bold leading-none text-navy md:text-5xl">Nuestros</h2>
          <p className="font-script -mt-1 text-5xl leading-none text-orange md:text-6xl">programas</p>
          <Sticker name="compu" size={76} rotate={8} className="absolute right-[6%] top-0 hidden sm:block md:right-[12%]" />
        </Reveal>
        <RevealGroup className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
          {PROGRAM_GROUPS.map((group, index) => (
            <RevealItem key={group.key}>
              <HoverCloud
                href={`/programas?categoria=${group.key}`}
                ariaLabel={group.label}
                pop={{ y: -10, scale: 1.04 }}
                side={index === PROGRAM_GROUPS.length - 1 ? "right" : "left"}
                info={{
                  title: group.label,
                  text: group.text,
                  chips: [counts[group.key] ? `${counts[group.key]} ${counts[group.key] === 1 ? "disponible" : "disponibles"}` : "Próximamente"],
                  cta: "Explorar",
                }}
                linkClassName="group relative block aspect-[3/4] overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_60px_-35px_rgba(13,40,79,0.6)]"
              >
                <Image
                  src={group.image}
                  alt={group.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
                <span className="absolute inset-x-0 bottom-[16%] px-3 text-center text-4xl font-bold leading-[0.95] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] md:text-[2.6rem]">
                  {group.label}
                </span>
              </HoverCloud>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {settings.about.mission && (
        <section className="container-page py-24 md:py-36">
          <p className="eyebrow">
            Nuestra <span className="text-orange">misión</span>
          </p>
          <ScrollText
            text={settings.about.mission}
            className="mt-6 max-w-5xl text-3xl font-bold leading-[1.2] text-navy md:text-5xl"
          />
        </section>
      )}

      <StickySteps eyebrow="Cómo funciona" title="Del clic a tu primera clase" accent="en 4 pasos." steps={STEPS} />

      {teachers.length > 0 && (
        <section className="py-24 md:py-32">
          <FloatingTiles tiles={teachers.map((t) => ({ key: t.id, name: t.name, image: t.photo_url }))}>
            <div className="container-page text-center">
              <SectionHeading eyebrow="Nuestros instructores" title="Aprende con quienes" accent="lo viven cada día." align="center" />
              <Reveal delay={0.2} className="mt-8 flex justify-center">
                <PrimaryLink href="/instructores">Conocer al equipo</PrimaryLink>
              </Reveal>
            </div>
          </FloatingTiles>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container-page grid gap-12 py-24 md:grid-cols-[0.8fr_1.2fr] md:py-32">
          <div>
            <SectionHeading eyebrow="Preguntas frecuentes" title="Pagos, modalidades" accent="y certificados." />
            <Reveal delay={0.2}>
              <p className="mt-6 text-sm text-ink/60">
                ¿No encuentras tu respuesta?{" "}
                <Link href="/contacto" className="font-semibold text-navy font-script text-[1.3em] hover:text-orange">
                  Escríbenos
                </Link>
              </p>
            </Reveal>
          </div>
          <Reveal>
            <Faq items={faqs.slice(0, 6)} />
          </Reveal>
        </section>
      )}

      {/* Llamado final (continúa en el pie de página azul) */}
      <section data-flush-footer className="bg-navy px-5 pb-16 pt-24 text-center text-white md:pb-20 md:pt-32">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">¿Listo para transformar tu futuro?</h2>
          <p className="mx-auto mt-6 max-w-md text-lg font-light text-white/90">Cuéntanos qué decidiste para aprender y te ayudamos con tu inscripción.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/programas"
              className="rounded-full bg-orange px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Ver programas
            </Link>
            <a
              href={advisor}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-go px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Habla con tu asesor
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
