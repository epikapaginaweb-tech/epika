import type { Metadata } from "next";
import Link from "next/link";
import { deleteCourse, setCourseVisibility } from "@/actions/admin/content";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmForm, SubmitButton } from "@/components/admin/ui";
import { CourseImage } from "@/components/site/CourseImage";
import { requireAdmin } from "@/lib/auth";
import { MODALITY_LABEL, formatDate, formatPrice } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/service";
import type { Course } from "@/lib/types";

export const metadata: Metadata = { title: "Cursos" };

export default async function AdminCoursesPage() {
  await requireAdmin();
  const { data } = await serviceClient().from("courses").select("*").order("sort").order("created_at", { ascending: false });
  const courses = (data as Course[] | null) ?? [];

  return (
    <>
      <PageHeader title="Cursos" description="Crea, edita, oculta o elimina cursos del catálogo." action={{ href: "/admin/cursos/nuevo", label: "+ Nuevo curso" }} />
      {courses.length === 0 && (
        <div className="rounded-3xl bg-white p-10 text-center">
          <p className="font-semibold text-navy">Aún no hay cursos.</p>
          <p className="mt-1 text-sm text-ink/55">Crea el primero y márcalo como visible para publicarlo.</p>
        </div>
      )}
      <ul className="grid gap-3">
        {courses.map((course) => (
          <li key={course.id} className="flex flex-wrap items-center gap-4 rounded-3xl bg-white p-3 pr-5">
            <div className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl ${course.visible ? "" : "opacity-40 grayscale"}`}>
              <CourseImage src={course.image_url} title={course.title} sizes="112px" />
            </div>
            <div className="min-w-48 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/cursos/${course.id}`} className="font-bold text-navy hover:text-orange">
                  {course.title}
                </Link>
                {!course.visible && <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-ink/50">Oculto</span>}
                {course.featured && <span className="rounded-full bg-orange-soft px-2 py-0.5 text-xs font-semibold text-[#b35f00]">Destacado</span>}
              </div>
              <p className="mt-1 text-xs text-ink/50">
                {[MODALITY_LABEL[course.modality], formatDate(course.start_date, { dateStyle: "medium" }), formatPrice(course.price, course.currency)].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/admin/cursos/${course.id}`} className="rounded-full bg-paper px-4 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
                Editar
              </Link>
              <form action={setCourseVisibility.bind(null, course.id, !course.visible)}>
                <SubmitButton pendingText="…" className={course.visible ? "!bg-paper !text-ink/70 hover:!bg-navy hover:!text-white" : ""}>
                  {course.visible ? "Ocultar" : "Publicar"}
                </SubmitButton>
              </form>
              {course.visible && (
                <Link href={`/cursos/${course.slug}`} target="_blank" className="px-2 text-sm font-semibold text-ink/50 hover:text-orange">
                  Ver ↗
                </Link>
              )}
              <ConfirmForm action={deleteCourse.bind(null, course.id)} message={`¿Eliminar «${course.title}»? Esta acción no se puede deshacer.`}>
                <button type="submit" className="rounded-full px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Eliminar
                </button>
              </ConfirmForm>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
