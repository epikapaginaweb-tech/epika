import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { CoverArt } from "@/components/site/CoverArt";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TAGS, getTeachers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Instructores",
  description: "Conoce al equipo de instructores de Épika Academy: perfil profesional, experiencia, especialidad y programas que imparte.",
  alternates: { canonical: "/instructores" },
};

export default async function TeachersPage() {
  "use cache";
  cacheTag(TAGS.teachers, TAGS.courses);
  cacheLife("hours");

  const teachers = await getTeachers();

  return (
    <section className="container-page pb-10 pt-12 md:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Equipo Épika"
        title="Instructores que te guían"
        accent="desde la experiencia."
        description="Profesionales activos en su área, comprometidos con que aprendas haciendo."
      />

      {teachers.length === 0 ? (
        <p className="mt-14 rounded-[2rem] bg-white p-10 text-ink/60">Muy pronto presentaremos a nuestro equipo de instructores.</p>
      ) : (
        <RevealGroup className="mt-14 grid gap-7 md:grid-cols-2">
          {teachers.map((teacher, i) => (
            <RevealItem key={teacher.id}>
              <Tilt className="h-full" max={4}>
                <article className="group grid h-full gap-6 rounded-[var(--radius-card)] bg-white p-3 sm:grid-cols-[13rem_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-[1.4rem] sm:aspect-auto sm:h-full sm:min-h-64">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                      {teacher.photo_url ? (
                        <Image
                          src={teacher.photo_url}
                          alt={teacher.name}
                          fill
                          sizes="(min-width: 640px) 13rem, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <CoverArt seed={teacher.name} />
                      )}
                    </div>
                    {teacher.specialty && (
                      <span className={`bubble absolute left-3 top-3 ${i % 2 ? "bg-orange" : "bg-navy"} text-white`}>
                        {teacher.specialty}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col p-3 sm:py-5 sm:pr-5">
                    <h2 className="text-2xl font-bold tracking-tight text-navy">{teacher.name}</h2>
                    {teacher.headline && <p className="mt-1 text-sm font-semibold text-orange">{teacher.headline}</p>}
                    {teacher.bio && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink/70">{teacher.bio}</p>}
                    {teacher.experience && (
                      <div className="mt-4 rounded-2xl bg-paper p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Experiencia</p>
                        <p className="mt-1 whitespace-pre-line text-sm text-ink/75">{teacher.experience}</p>
                      </div>
                    )}
                    {teacher.courses.length > 0 && (
                      <div className="mt-auto pt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Imparte</p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {teacher.courses.map((course) => (
                            <li key={course.id}>
                              <Link
                                href={`/programas/${course.slug}`}
                                className="inline-block rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-orange hover:bg-orange hover:text-white"
                              >
                                {course.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
