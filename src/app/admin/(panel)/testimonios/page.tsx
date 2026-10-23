import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { NewTestimonialEditor, TestimonialEditor } from "@/components/admin/TestimonialEditor";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/service";
import type { Testimonial } from "@/lib/types";

export const metadata: Metadata = { title: "Testimonios" };

export default async function TestimonialsAdminPage() {
  await requireAdmin();
  const { data } = await serviceClient().from("testimonials").select("*").order("sort").order("created_at");
  const testimonials = (data as Testimonial[] | null) ?? [];

  return (
    <>
      <PageHeader title="Testimonios" description="Solo se publican los marcados como autorizados y visibles." />
      <div className="space-y-3">
        <NewTestimonialEditor />
        {testimonials.map((t) => (
          <TestimonialEditor key={t.id} testimonial={t} />
        ))}
      </div>
    </>
  );
}
