import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/CourseForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";

export const metadata: Metadata = { title: "Nuevo curso" };

export default async function NewCoursePage() {
  await requireAdmin();
  const { data } = await serviceClient().from("teachers").select("id, name").order("name");
  return (
    <>
      <PageHeader title="Nuevo curso" description="Completa lo que tengas; puedes guardarlo oculto y publicarlo después." />
      <CourseForm teachers={data ?? []} />
    </>
  );
}
