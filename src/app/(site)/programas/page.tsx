import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppLink } from "@/components/site/Buttons";
import type { CatalogCardData } from "@/components/site/CatalogCard";
import { CatalogView } from "@/components/site/CatalogView";
import { CoverArt } from "@/components/site/CoverArt";
import { TAGS, getCourses, getSettings } from "@/lib/data";
import { CATEGORIES, CATEGORY_LABEL, type Course } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Programas",
  description: "Explora el catálogo de programas de Épika Academy: modalidad, temario, instructores, fechas e inversión.",
  alternates: { canonical: "/programas" },
};

function toCatalog(course: Course): CatalogCardData {
  const category = course.category ?? "programa";
  return {
    slug: course.slug,
    title: course.title,
    image: course.image_url,
    categoryKey: category,
    categoryLabel: CATEGORY_LABEL[category],
    rating: Number(course.rating ?? 5),
    modules: course.modules?.length ?? 0,
    duration: course.duration,
    showEcuador: course.show_ecuador ?? true,
    comingSoon: course.coming_soon ?? false,
  };
}

export default async function CoursesPage() {
  "use cache";
  cacheTag(TAGS.courses, TAGS.settings);
  cacheLife("hours");

  const [allCourses, settings] = await Promise.all([getCourses(), getSettings()]);
  const { offer } = settings;
  const enabled = CATEGORIES.filter((c) => offer[c] !== false);
  const courses = allCourses.filter((c) => enabled.includes(c.category ?? "programa"));
  const filters = enabled.map((c) => ({ key: c, label: CATEGORY_LABEL[c] }));

  return (
    <section className="container-page pb-10 pt-10 md:pt-14">
      <div>
        {courses.length > 0 ? (
          <Suspense fallback={null}>
            <CatalogView courses={courses.map(toCatalog)} filters={filters} showComingSoon={offer.showComingSoon} slogan={offer.comingSoonSlogan} />
          </Suspense>
        ) : (
          <Reveal>
            <h1 className="bolder mb-10 text-center text-5xl font-bold text-navy md:text-6xl">
              Nuestros <span className="font-script block text-[1.75em] leading-[0.8] font-normal text-orange">programas</span>
            </h1>
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
