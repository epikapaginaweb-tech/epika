import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";
import type { Teacher } from "@/lib/types";

export const metadata: Metadata = { title: "Editar docente" };

export default async function EditTeacherPage({ params }: PageProps<"/admin/docentes/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await serviceClient().from("teachers").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const teacher = data as Teacher;

  return (
    <>
      <PageHeader title="Editar docente" description={teacher.name} />
      <TeacherForm teacher={teacher} />
    </>
  );
}
