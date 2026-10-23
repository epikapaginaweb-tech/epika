import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { FloatingShapes } from "@/components/motion/FloatingShapes";
import { HeroBackdrop } from "@/components/motion/HeroBackdrop";
import { ParallaxOut } from "@/components/motion/ParallaxOut";
import { ScrollText } from "@/components/motion/ScrollText";
import { Tilt } from "@/components/motion/Tilt";
import { ScrollScale } from "@/components/motion/ScrollScale";
import { Spotlight } from "@/components/motion/Spotlight";
import { PrimaryLink, WhatsAppLink } from "@/components/site/Buttons";
import { CascadeCards, type CascadeItem } from "@/components/site/CascadeCards";
import { CourseCard } from "@/components/site/CourseCard";
import { CourseFan, type FanItem } from "@/components/site/CourseFan";
import { Faq } from "@/components/site/Faq";
import { FloatingTiles } from "@/components/site/FloatingTiles";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Stats } from "@/components/site/Stats";
import { StickySteps } from "@/components/site/StickySteps";
import { toCardData, upcoming } from "@/lib/course-view";
import { TAGS, getCourses, getFaqs, getSettings, getTeachers, getTestimonials } from "@/lib/data";
import { MODALITY_LABEL, formatDate } from "@/lib/format";
import type { CourseWithTeacher } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

const FAN_SIZE = 7;
const SOON_TAGS = ["Virtual", "En línea", "100% virtual"];

const STEPS = [
  { title: "Elige tu programa", text: "Brochure, el instructor y la fecha de inicio." },
  { title: "Solicita tu reserva", text: "Completa el formulario en menos de un minuto." },
  { title: "Confirma tu pago", text: "Transfiere o paga por SINPE y sube tu comprobante desde el sitio." },
  { title: "Recibe tus accesos", text: "Te enviamos tu usuario y contraseña por WhatsApp para empezar." },
];

function fanItems(courses: CourseWithTeacher[], promoLabel: string): FanItem[] {
  const toItem = (c: CourseWithTeacher): FanItem => ({
    key: c.id,
    title: c.title,
    image: c.image_url,
    tag: MODALITY_LABEL[c.modality],
    href: `/programas/${c.slug}`,
  });
  const soon = (i: number): FanItem => ({
    key: `soon-${i}`,
    title: "Muy pronto",
    seed: `Épika ${i}`,
    image: null,
    tag: SOON_TAGS[i % 3],
    href: "/programas",
  });

  // La tarjeta central muestra el programa destacado (promoción / programa estrella).
  const center = Math.floor(FAN_SIZE / 2);
  const featured = courses.find((c) => c.featured);
  const rest = courses.filter((c) => c !== featured);
  let next = 0;
  return Array.from({ length: FAN_SIZE }, (_, i) => {
    if (i === center) {
      return featured ? { ...toItem(featured), badge: promoLabel } : { ...soon(i), badge: promoLabel };
    }
    const course = rest[next++];
    return course ? toItem(course) : soon(i);
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

  const today = new Date().toISOString().slice(0, 10);
  const next = upcoming(courses, today).slice(0, 5);
  const cascade: CascadeItem[] = next.map((c) => ({
    key: c.id,
    title: c.title,
    image: c.image_url,
    tag: formatDate(c.start_date, { day: "numeric", month: "short" }) ?? MODALITY_LABEL[c.modality],
    href: `/programas/${c.slug}`,
  }));
  const whatsapp = whatsappUrl(settings.whatsapp, "Hola, quiero información sobre los programas de Épika Academy.", settings.countryCode);
  const advisor = whatsappUrl(settings.salesWhatsapp || settings.whatsapp, "Hola, quiero información sobre los programas de Épika Academy.", settings.countryCode);
  const { hero } = settings;

  return (
    <>
      <section className="relative isolate overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16">
        <HeroBackdrop />
        <ParallaxOut className="container-page text-center">
          <Reveal y={12}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-navy shadow-sm">
              <span className="size-1.5 rounded-full bg-orange" />
              {hero.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h1"
            text={hero.title}
            accent={hero.highlight}
            delay={0.1}
            underline
            className="mx-auto mt-6 max-w-4xl text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
          />
        </ParallaxOut>

        <div className="mt-10 md:mt-14">
          <CourseFan items={fanItems(courses, settings.promoLabel)} />
        </div>

        <div className="container-page text-center">
          <Reveal delay={0.6}>
            {hero.subtitle && <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">{hero.subtitle}</p>}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryLink href="/programas">Ver programas</PrimaryLink>
            </div>
          </Reveal>
        </div>
      </section>

      {settings.stats.length > 0 && (
        <section className="container-page pb-8">
          <Stats stats={settings.stats} />
        </section>
      )}

      <section className="container-page grid items-center gap-12 py-24 md:grid-cols-[0.9fr_1.1fr] md:py-32">
        <div>
          <SectionHeading
            eyebrow="Próximos programas"
            title="Elige tu programa y"
            accent="asegura tu lugar."
            description={
              next.length > 0
                ? "Estas son las próximas aperturas. Revisa el temario, el instructor y la inversión de cada programa antes de reservar."
                : "Muy pronto anunciaremos las próximas aperturas. Escríbenos y te avisamos primero."
            }
          />
          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
            <PrimaryLink href="/programas">Ver todo el catálogo</PrimaryLink>
            {next.length === 0 && <WhatsAppLink href={whatsapp}>Quiero que me avisen</WhatsAppLink>}
          </Reveal>
        </div>
        {cascade.length > 0 ? (
          <>
            <div className="hidden md:block">
              <CascadeCards items={cascade} />
            </div>
            <div className="grid gap-6 md:hidden">
              {next.slice(0, 3).map((course, i) => (
                <CourseCard key={course.id} course={toCardData(course)} index={i} />
              ))}
            </div>
          </>
        ) : (
          <CascadeCards
            items={Array.from({ length: 5 }, (_, i) => ({
              key: `soon-${i}`,
              title: "Muy pronto",
              seed: `Épika ${i + 2}`,
              image: null,
              tag: "Próximamente",
              href: "/contacto",
            }))}
          />
        )}
      </section>

      <section className="relative isolate overflow-hidden bg-white py-24 md:py-32">
        <FloatingShapes />
        <div className="container-page">
          <SectionHeading eyebrow="Por qué Épika" title="Estudiar con nosotros" accent="se nota." align="center" />
          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {settings.benefits.map((benefit, i) => (
              <RevealItem key={benefit.title}>
                <Spotlight className="group h-full overflow-hidden rounded-[var(--radius-card)] bg-paper p-7 transition-transform duration-500 hover:-translate-y-2">
                  <span className="text-sm font-bold text-orange">0{i + 1}</span>
                  <h3 className="mt-10 text-xl font-bold tracking-tight text-navy">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{benefit.text}</p>
                  <span
                    aria-hidden
                    className="absolute -bottom-6 -right-2 text-8xl font-extrabold leading-none text-navy/5 transition-transform duration-700 group-hover:-translate-y-3 group-hover:scale-110"
                  >
                    {i + 1}
                  </span>
                </Spotlight>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {settings.about.mission && (
        <section className="container-page py-24 md:py-36">
          <p className="eyebrow">
            Nuestra <span className="text-orange">misión</span>
          </p>
          <ScrollText
            text={settings.about.mission}
            className="mt-6 max-w-5xl text-3xl font-bold leading-[1.2] tracking-tight text-navy md:text-5xl"
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

      {testimonials.length > 0 && (
        <section className="container-page py-24 md:py-32">
          <SectionHeading eyebrow="Testimonios" title="Lo que dicen" accent="nuestros estudiantes." />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <RevealItem key={t.id}>
                <Tilt className="h-full">
                  <figure
                    className={`flex h-full flex-col rounded-[var(--radius-card)] p-7 ${i % 3 === 1 ? "bg-navy text-white" : "bg-white"}`}
                  >
                    <span aria-hidden className="text-5xl font-extrabold leading-none text-orange">
                      “
                    </span>
                    <blockquote className={`mt-2 flex-1 leading-relaxed ${i % 3 === 1 ? "text-white/85" : "text-ink/75"}`}>
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-6">
                      <p className="font-bold">{t.name}</p>
                      {t.course && <p className={`text-sm ${i % 3 === 1 ? "text-white/60" : "text-ink/50"}`}>{t.course}</p>}
                    </figcaption>
                  </figure>
                </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container-page grid gap-12 py-24 md:grid-cols-[0.8fr_1.2fr] md:py-32">
          <div>
            <SectionHeading eyebrow="Preguntas frecuentes" title="Pagos, modalidades" accent="y certificados." />
            <Reveal delay={0.2}>
              <p className="mt-6 text-sm text-ink/60">
                ¿No encuentras tu respuesta?{" "}
                <Link href="/contacto" className="font-semibold text-navy underline decoration-orange underline-offset-4">
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

      <section className="container-page pt-10">
        <ScrollScale className="relative overflow-hidden bg-navy">
          <div className="relative px-6 py-16 text-center md:px-16 md:py-24">
            <div aria-hidden className="absolute -right-24 -top-24 size-72 animate-blob rounded-full bg-orange/90" />
            <div aria-hidden className="absolute -bottom-32 -left-20 size-80 rounded-full bg-white/5" />
            <div className="relative">
              <RevealText
                tone="light"
                text="Listos para"
                accent="transformar tu futuro."
                className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl"
              />
              <p className="mx-auto mt-5 max-w-lg text-white/70">Cuéntanos qué decidiste para aprender y te ayudamos con tu inscripción.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/programas"
                  className="rounded-full bg-orange px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-navy"
                >
                  Ver programas
                </Link>
                <WhatsAppLink href={advisor} tone="dark">
                  Habla con tu asesor
                </WhatsAppLink>
              </div>
            </div>
          </div>
        </ScrollScale>
      </section>
    </>
  );
}
