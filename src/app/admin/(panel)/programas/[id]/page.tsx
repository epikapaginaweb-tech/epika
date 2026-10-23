import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseForm } from "@/components/admin/CourseForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";
import type { Course } from "@/lib/types";

export const metadata: Metadata = { title: "Editar programa" };

export default async function EditCoursePage({ params }: PageProps<"/admin/programas/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = serviceClient();
  const [{ data: course }, { data: teachers }] = await Promise.all([
    db.from("courses").select("*").eq("id", id).maybeSingle(),
    db.from("teachers").select("id, name").order("name"),
  ]);
  if (!course) notFound();

  return (
    <>
      <PageHeader title="Editar programa" description={(course as Course).title} />
      <CourseForm course={course as Course} teachers={teachers ?? []} />
    </>
  );
}
