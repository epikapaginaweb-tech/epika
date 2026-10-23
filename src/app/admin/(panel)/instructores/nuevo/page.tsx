import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Nuevo instructor" };

export default async function NewTeacherPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Nuevo instructor" />
      <TeacherForm />
    </>
  );
}
