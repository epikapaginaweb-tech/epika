import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Odometer } from "@/components/motion/Odometer";
import { ParallaxOut } from "@/components/motion/ParallaxOut";
import { ScrollText } from "@/components/motion/ScrollText";
import { CourseFan, type FanItem } from "@/components/site/CourseFan";
import { Faq } from "@/components/site/Faq";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Sticker, type StickerName } from "@/components/site/Sticker";
import { StickySteps } from "@/components/site/StickySteps";
import { TestimonialMarquee } from "@/components/site/TestimonialMarquee";
import { toCardData } from "@/lib/course-view";
import { TAGS, getCourses, getFaqs, getSettings, getTestimonials } from "@/lib/data";
import type { CourseWithTeacher } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

const FAN_SIZE = 5;
const FAN_PHOTOS = ["/brand/fotos/hero-1.jpg", "/brand/fotos/hero-2.jpg", "/brand/fotos/hero-3.jpg", "/brand/fotos/hero-2.jpg", "/brand/fotos/hero-1.jpg"];
const BENEFIT_ICONS: StickerName[] = ["carita", "manos", "compu", "paz"];
// Los PNG traen distinto margen transparente: estos tamaños hacen que todos se vean iguales.
const ICON_SIZE: Partial<Record<StickerName, number>> = { carita: 190, manos: 122, compu: 112, paz: 172 };

const PROGRAM_GROUPS = [
  { label: "Programas", key: "programa", image: "/brand/fotos/programas.jpg", alt: "Persona estudiando con su laptop", text: "Formación completa con instructor, módulos, certificación y acompañamiento." },
  { label: "Seminarios", key: "seminario", image: "/brand/fotos/seminarios.jpg", alt: "Persona concentrada frente a su computadora", text: "Sesiones intensivas y puntuales para aprender algo concreto en poco tiempo." },
  { label: "Otros", key: "otro", image: "/brand/fotos/otros.jpg", alt: "Persona trabajando en su escritorio", text: "Talleres, mentorías y experiencias especiales para completar tu perfil." },
];

const STEPS = [
  { title: "Elige tu programa", text: "Revisa el brochure, el instructor y la fecha de inicio." },
  { title: "Solicita tu reserva", text: "Completa el formulario en menos de un minuto." },
  { title: "Confirma tu pago", text: "Transfiere y sube tu comprobante desde el sitio." },
  { title: "Recibe tus accesos", text: "Te enviamos tus credenciales institucionales por WhatsApp para que puedas acceder al campus virtual." },
];

// El centro del abanico muestra el programa destacado (promoción / programa estrella).
function fanItems(courses: CourseWithTeacher[], promoLabel: string): FanItem[] {
  const center = Math.floor(FAN_SIZE / 2);
  const featured = courses.find((c) => c.featured);
  const rest = courses.filter((c) => c !== featured && !c.coming_soon);
  let next = 0;

  return Array.from({ length: FAN_SIZE }, (_, i): FanItem => {
    const course = i === center ? featured : rest[next++];
    if (course) {
      const card = toCardData(course);
      return {
        info: {
          title: course.title,
          chips: [course.modality === "virtual" ? "100% virtual" : card.modality],
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
      info: { title: "Épika Academy", chips: ["100% virtual"], cta: "Ver programas" },
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

  const [courses, faqs, testimonials, settings] = await Promise.all([
    getCourses(),
    getFaqs(),
    getTestimonials(),
    getSettings(),
  ]);

  const advisor = whatsappUrl(settings.salesWhatsapp || settings.whatsapp, "Hola, quiero información sobre los programas de Épika Academy.", settings.countryCode);
  const { hero } = settings;
  const { offer } = settings;
  const groups = PROGRAM_GROUPS.filter((g) => offer[g.key as keyof typeof offer] !== false);

  return (
    <>
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-white pb-12 pt-8 md:pb-14 md:pt-12">
        <ParallaxOut className="container-page relative text-center">
          <div className="relative mx-auto max-w-2xl">
            <Sticker name="reloj" size={78} rotate={-10} className="absolute -left-2 top-[38%] hidden md:-left-10 md:block" />
            <RevealText
              as="h1"
              text={hero.title}
              accent={hero.highlight || "Lidera tu futuro"}
              accentFont="sans"
              delay={0.1}
              className="bolder text-[2.9rem] font-bold leading-[0.95] sm:text-6xl md:text-7xl"
            />
          </div>
          {hero.subtitle && <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">{hero.subtitle}</p>}
        </ParallaxOut>

        <div className="mt-8 md:mt-10">
          <CourseFan items={fanItems(courses, settings.promoLabel)} />
        </div>

        <div className="container-page text-center">
          <Reveal delay={3.1}>
            <Link
              href="/programas"
              className="inline-flex items-center justify-center rounded-full bg-orange px-7 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(255,145,0,0.8)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Ver programas
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Por qué Épika + cifra */}
      <section className="relative isolate overflow-hidden bg-navy py-14 text-white md:py-16">
        <div className="container-page text-center">
          <Reveal>
            <p className="text-2xl font-light md:text-3xl">Porque</p>
            <h2 className="bolder mt-1 text-3xl font-bold leading-tight md:text-5xl">
              Aprender con nosotros <span className="font-script inline-block whitespace-nowrap text-[1.75em] font-normal leading-none text-orange [-webkit-text-stroke:0]">se nota</span>
            </h2>
          </Reveal>

          <RevealGroup className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {settings.benefits.slice(0, 4).map((benefit, i) => (
              <RevealItem key={benefit.title}>
                <div className="flex flex-col items-center">
                  <span className="flex size-28 items-center justify-center md:size-36">
                    <Sticker name={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} size={ICON_SIZE[BENEFIT_ICONS[i % BENEFIT_ICONS.length]] ?? 124} rotate={i % 2 ? 6 : -6} delay={i * 0.15} className="scale-[0.8] md:scale-100" />
                  </span>
                  <h3 className="mt-3 max-w-[8.5rem] text-balance text-lg font-bold leading-tight md:text-xl">{benefit.title}</h3>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {settings.stats.length > 0 && (
            <div className="mt-12 flex flex-wrap items-end justify-center gap-x-16 gap-y-12 md:mt-14">
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

      {/* Testimonios: carrusel lento de derecha a izquierda */}
      {testimonials.length > 0 && (
        <section className="py-14 md:py-16">
          <Reveal>
            <h2 className="bolder text-center text-5xl font-bold text-navy md:text-6xl">Testimonios</h2>
          </Reveal>
          <TestimonialMarquee items={testimonials.map((t) => ({ id: t.id, name: t.name, place: t.course, quote: t.quote }))} className="mt-10" />
        </section>
      )}

      {/* Oferta académica (se activa/desactiva desde el panel, igual que cada categoría) */}
      {offer.enabled && groups.length > 0 && (
        <section className="container-page py-12 md:py-16">
          <div className="relative text-center">
            <RevealText text="Oferta" accent="académica" accentFont="script" className="bolder text-5xl font-bold leading-none md:text-6xl" />
            <Sticker name="compu" size={76} rotate={8} className="absolute right-[6%] top-0 hidden sm:block md:right-[12%]" />
          </div>
          <RevealGroup className={`mx-auto mt-10 grid max-w-5xl gap-5 ${groups.length === 3 ? "sm:grid-cols-3" : groups.length === 2 ? "sm:grid-cols-2" : "max-w-sm"}`}>
            {groups.map((group) => (
              <RevealItem key={group.key}>
                <Link
                  href={`/programas?categoria=${group.key}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_60px_-35px_rgba(13,40,79,0.6)] transition-transform duration-500 ease-out hover:-translate-y-2"
                >
                  <Image
                    src={group.image}
                    alt={group.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent" />
                  <span className="bolder absolute inset-x-0 bottom-[16%] px-3 text-center text-4xl font-bold leading-[0.95] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] md:text-[2.6rem]">
                    {group.label}
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {settings.about.mission && (
        <section className="container-page py-14 md:py-20">
          <p className="eyebrow">
            Nuestra <span className="text-orange">misión</span>
          </p>
          <ScrollText
            text={settings.about.mission}
            className="mt-6 max-w-5xl text-3xl font-bold leading-[1.2] text-navy md:text-5xl"
          />
        </section>
      )}

      <StickySteps eyebrow="¿Cómo funciona?" title="Del clic a tu primera clase" accent="en 4 pasos." steps={STEPS} />

      {faqs.length > 0 && (
        <section className="container-page grid gap-12 py-14 md:grid-cols-[0.8fr_1.2fr] md:py-20">
          <div>
            <SectionHeading eyebrow="Preguntas frecuentes" title="Pagos, modalidades" accent="y certificados." />
            <Reveal delay={0.2}>
              <p className="mt-6 text-sm text-ink/60">
                ¿No encuentras tu respuesta?{" "}
                <Link href="/contacto" className="font-semibold text-orange hover:underline">
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
      <section data-flush-footer className="bg-navy px-5 pb-14 pt-16 text-center text-white md:pb-16 md:pt-20">
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
