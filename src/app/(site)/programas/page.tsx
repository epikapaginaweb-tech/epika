import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppLink } from "@/components/site/Buttons";
import { CourseGrid } from "@/components/site/CourseGrid";
import { CoverArt } from "@/components/site/CoverArt";
import { SectionHeading } from "@/components/site/SectionHeading";
import { toCardData } from "@/lib/course-view";
import { TAGS, getCourses, getSettings } from "@/lib/data";
import { MODALITY_LABEL } from "@/lib/format";
import { MODALITIES } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Programas",
  description: "Explora el catálogo de programas de Épika Academy: modalidad, temario, instructores, fechas e inversión.",
  alternates: { canonical: "/programas" },
};

export default async function CoursesPage() {
  "use cache";
  cacheTag(TAGS.courses, TAGS.settings);
  cacheLife("hours");

  const [courses, settings] = await Promise.all([getCourses(), getSettings()]);
  const filters = MODALITIES.filter((m) => courses.some((c) => c.modality === m)).map((m) => ({
    key: m,
    label: MODALITY_LABEL[m],
  }));

  return (
    <section className="container-page pb-10 pt-12 md:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Catálogo Épika"
        title="Programas para dar"
        accent="tu siguiente paso."
        description="Programas 100% virtuales. Cada uno incluye su temario, instructor, fechas e inversión."
      />
      <div className="mt-14">
        {courses.length > 0 ? (
          <CourseGrid courses={courses.map((c) => ({ ...toCardData(c), modalityKey: c.modality }))} filters={filters} />
        ) : (
          <Reveal>
            <div className="grid items-center gap-10 rounded-[2rem] bg-white p-8 md:grid-cols-[1fr_auto] md:p-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-navy">Estamos preparando el catálogo.</h2>
                <p className="mt-3 max-w-lg text-ink/65">
                  Muy pronto publicaremos los próximos programas. Escríbenos y te avisamos apenas abran las inscripciones.
                </p>
                <div className="mt-6">
                  <WhatsAppLink href={whatsappUrl(settings.whatsapp, "Hola, quiero que me avisen cuando abran los programas de Épika Academy.", settings.countryCode)}>
                    Quiero que me avisen
                  </WhatsAppLink>
                </div>
              </div>
              <div className="flex -space-x-10">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-40 w-32 overflow-hidden rounded-2xl ring-4 ring-white" style={{ transform: `rotate(${(i - 1) * 8}deg)` }}>
                    <CoverArt seed={`Épika ${i + 3}`} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
