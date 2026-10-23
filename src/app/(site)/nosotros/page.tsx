import type { Metadata } from "next";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { PrimaryLink } from "@/components/site/Buttons";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Stats } from "@/components/site/Stats";
import { TAGS, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia, misión, visión y metodología de Épika Academy.",
  alternates: { canonical: "/nosotros" },
};

export default async function AboutPage() {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");

  const { about, stats } = await getSettings();
  const hasContent = Boolean(about.history || about.mission || about.vision || about.methodology.length || about.gallery.length || stats.length);

  return (
    <>
      <section className="container-page pb-16 pt-12 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="Sobre Épika"
          title="Una academia hecha para"
          accent="quienes van por más."
          description={about.intro || undefined}
        />
      </section>

      {!hasContent && (
        <section className="container-page">
          <Reveal>
            <div className="rounded-[2rem] bg-white p-10 text-ink/60">
              Estamos preparando esta sección. Muy pronto compartiremos nuestra historia y la forma en que enseñamos.
            </div>
          </Reveal>
        </section>
      )}

      {about.history && (
        <section className="container-page grid gap-10 border-t border-line py-16 md:grid-cols-[0.7fr_1.3fr] md:py-24">
          <div>
            <p className="eyebrow">Historia</p>
            <RevealText text="Cómo empezó" accent="Épika." className="mt-3 text-3xl font-bold tracking-tight md:text-5xl" />
          </div>
          <Reveal>
            <p className="whitespace-pre-line text-lg leading-relaxed text-ink/70">{about.history}</p>
          </Reveal>
        </section>
      )}

      {(about.mission || about.vision) && (
        <section className="container-page grid gap-5 py-8 md:grid-cols-2">
          {about.mission && (
            <Reveal>
              <div className="h-full rounded-[2rem] bg-navy p-8 text-white md:p-12">
                <p className="eyebrow !text-orange">Misión</p>
                <p className="mt-5 whitespace-pre-line text-xl leading-relaxed md:text-2xl">{about.mission}</p>
              </div>
            </Reveal>
          )}
          {about.vision && (
            <Reveal delay={0.1}>
              <div className="h-full rounded-[2rem] bg-orange p-8 text-white md:p-12">
                <p className="eyebrow !text-white/80">Visión</p>
                <p className="mt-5 whitespace-pre-line text-xl leading-relaxed md:text-2xl">{about.vision}</p>
              </div>
            </Reveal>
          )}
        </section>
      )}

      {stats.length > 0 && (
        <section className="container-page py-16">
          <Stats stats={stats} />
        </section>
      )}

      {about.methodology.length > 0 && (
        <section className="container-page py-16 md:py-24">
          <SectionHeading eyebrow="Metodología" title="Así aprendes" accent="en Épika." />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {about.methodology.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="relative h-full rounded-[var(--radius-card)] bg-white p-7">
                  <span className="text-6xl font-extrabold leading-none text-orange-soft">{i + 1}</span>
                  <h3 className="mt-6 text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {about.gallery.length > 0 && (
        <section className="container-page py-16">
          <RevealGroup className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {about.gallery.map((src, i) => (
              <RevealItem key={src}>
                <div className={`relative overflow-hidden rounded-3xl ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                  <Image src={src} alt={`Épika Academy, fotografía ${i + 1}`} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="container-page pt-10 text-center">
        <Reveal>
          <PrimaryLink href="/programas">Ver programas disponibles</PrimaryLink>
        </Reveal>
      </section>
    </>
  );
}
