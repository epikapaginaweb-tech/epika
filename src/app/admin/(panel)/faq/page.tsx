import type { Metadata } from "next";
import { FaqEditor, NewFaqEditor } from "@/components/admin/FaqEditor";
import { PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";
import type { Faq } from "@/lib/types";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

export default async function FaqAdminPage() {
  await requireAdmin();
  const { data } = await serviceClient().from("faqs").select("*").order("sort").order("created_at");
  const faqs = (data as Faq[] | null) ?? [];

  return (
    <>
      <PageHeader title="Preguntas frecuentes" description="Sobre pagos, modalidades y certificados. Se muestran en Inicio y Contacto." />
      <div className="space-y-3">
        <NewFaqEditor />
        {faqs.map((faq) => (
          <FaqEditor key={faq.id} faq={faq} />
        ))}
      </div>
    </>
  );
}
