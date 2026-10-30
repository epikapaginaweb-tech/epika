import type { Metadata } from "next";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TAGS, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce la historia, misión, visión y pilares estratégicos de Épika Academy.",
  alternates: { canonical: "/nosotros" },
};

const toLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export default async function AboutPage() {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");

  const { about } = await getSettings();
  const cover = about.gallery[0];
  const rest = about.gallery.slice(1);

  return (
    <>
      {/* Encabezado */}
      <section className="container-page grid items-center gap-10 pb-12 pt-10 md:grid-cols-[1fr_1fr] md:pb-16 md:pt-14">
        <div>
          <RevealText
            as="h1"
            text="Una academia hecha para"
            accent="quienes van por más."
            className="bolder text-4xl font-bold leading-[1.02] md:text-5xl"
          />
          {about.intro && <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/65 md:text-lg">{about.intro}</p>}
        </div>
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2.25rem] bg-navy">
            {cover ? (
              <Image src={cover} alt="Épika Academy" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Image src="/brand/logo-light.png" alt="Épika Academy" width={1186} height={438} className="h-16 w-auto opacity-90 md:h-20" />
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* Misión y visión */}
      {(about.mission || about.vision) && (
        <section className="container-page space-y-10 py-10 md:space-y-14 md:py-14">
          {[
            { title: "Misión", text: about.mission },
            { title: "Visión", text: about.vision },
          ]
            .filter((row) => row.text)
            .map((row) => (
              <Reveal key={row.title}>
                <div className="grid items-center gap-4 md:grid-cols-[0.35fr_1fr] md:gap-12">
                  <h2 className="bolder text-4xl font-bold text-navy md:text-center md:text-5xl">{row.title}</h2>
                  <p className="whitespace-pre-line text-justify text-base leading-relaxed text-ink/75">{row.text}</p>
                </div>
              </Reveal>
            ))}
        </section>
      )}

      {about.history && (
        <section className="container-page grid gap-6 py-10 md:grid-cols-[0.35fr_1fr] md:gap-12 md:py-14">
          <h2 className="bolder text-4xl font-bold text-navy md:text-center md:text-5xl">Historia</h2>
          <Reveal>
            <p className="whitespace-pre-line text-justify text-base leading-relaxed text-ink/75">{about.history}</p>
          </Reveal>
        </section>
      )}

      {/* Pilares estratégicos */}
      {about.pillars.length > 0 && (
        <section className="container-page py-10 md:py-14">
          <Reveal>
            <h2 className="bolder text-4xl font-bold text-orange md:text-5xl">Pilares Estratégicos</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
              Los pilares son las grandes apuestas de Épika para los próximos años. Cada uno tiene un objetivo y unos ejes que convierten la visión en acciones concretas, medibles y sostenibles.
            </p>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2">
            {about.pillars.map((pillar) => (
              <RevealItem key={pillar.title}>
                <article className="h-full rounded-[2rem] bg-white p-7 md:p-9">
                  <h3 className="bolder text-2xl font-bold leading-tight text-navy">{pillar.title}</h3>
                  {pillar.objective && (
                    <p className="mt-4 text-base leading-relaxed text-ink/75">
                      <span className="font-bold text-ink">Objetivo: </span>
                      {pillar.objective}
                    </p>
                  )}
                  {toLines(pillar.axes).length > 0 && (
                    <>
                      <p className="mt-5 font-bold text-ink">Ejes estratégicos</p>
                      <ul className="mt-3 space-y-2">
                        {toLines(pillar.axes).map((axis) => (
                          <li key={axis} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-orange" />
                            {axis}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {about.methodology.length > 0 && (
        <section className="container-page py-10 md:py-14">
          <SectionHeading eyebrow="Metodología" title="Así aprendes" accent="en Épika." />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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

      {rest.length > 0 && (
        <section className="container-page py-10">
          <RevealGroup className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {rest.map((src, i) => (
              <RevealItem key={src}>
                <div className={`relative overflow-hidden rounded-3xl ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                  <Image src={src} alt={`Épika Academy, fotografía ${i + 2}`} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

    </>
  );
}
