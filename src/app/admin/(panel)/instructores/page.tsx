import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deleteTeacher, setTeacherVisibility } from "@/actions/admin/content";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmForm, SubmitButton } from "@/components/admin/ui";
import { CoverArt } from "@/components/site/CoverArt";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";
import type { Teacher } from "@/lib/types";

export const metadata: Metadata = { title: "Instructores" };

export default async function AdminTeachersPage() {
  await requireAdmin();
  const { data } = await serviceClient().from("teachers").select("*").order("sort").order("name");
  const teachers = (data as Teacher[] | null) ?? [];

  return (
    <>
      <PageHeader title="Instructores" description="Perfiles que aparecen en la página Instructores y en cada programa." action={{ href: "/admin/instructores/nuevo", label: "+ Nuevo instructor" }} />
      {teachers.length === 0 && <p className="rounded-3xl bg-white p-10 text-center text-sm text-ink/55">Aún no hay instructores registrados.</p>}
      <ul className="grid gap-3 md:grid-cols-2">
        {teachers.map((t) => (
          <li key={t.id} className="flex items-center gap-4 rounded-3xl bg-white p-3 pr-4">
            <div className={`relative size-16 shrink-0 overflow-hidden rounded-2xl ${t.visible ? "" : "opacity-40 grayscale"}`}>
              {t.photo_url ? <Image src={t.photo_url} alt="" fill sizes="64px" className="object-cover" /> : <CoverArt seed={t.name} />}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/admin/instructores/${t.id}`} className="font-bold text-navy hover:text-orange">
                {t.name}
              </Link>
              <p className="truncate text-xs text-ink/50">{t.headline ?? t.specialty ?? "Sin perfil"}</p>
            </div>
            <form action={setTeacherVisibility.bind(null, t.id, !t.visible)}>
              <SubmitButton pendingText="…" className="!bg-paper !px-3 !py-2 !text-xs !text-ink/70 hover:!bg-navy hover:!text-white">
                {t.visible ? "Ocultar" : "Mostrar"}
              </SubmitButton>
            </form>
            <ConfirmForm action={deleteTeacher.bind(null, t.id)} message={`¿Eliminar a ${t.name}? Los programas asignados quedarán sin instructor.`}>
              <button type="submit" className="text-xs font-semibold text-red-600" aria-label={`Eliminar ${t.name}`}>
                Eliminar
              </button>
            </ConfirmForm>
          </li>
        ))}
      </ul>
    </>
  );
}
