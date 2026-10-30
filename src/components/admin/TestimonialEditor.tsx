"use client";

import { useEffect, useState } from "react";
import { deleteTestimonial, saveTestimonial } from "@/actions/admin/content";
import type { Testimonial } from "@/lib/types";
import { MediaInput } from "./MediaInput";
import { ConfirmForm, FormMessage, Label, SubmitButton, TextArea, TextInput, Toggle, useFormAction } from "./ui";

type CourseOption = { id: string; title: string };

export function TestimonialEditor({ testimonial, courses, onSaved }: { testimonial?: Testimonial; courses: CourseOption[]; onSaved?: () => void }) {
  const { state, onSubmit, pending } = useFormAction(saveTestimonial);

  useEffect(() => {
    if (state.ok) onSaved?.();
  }, [state, onSaved]);
  const t = testimonial;

  return (
    <div className="rounded-3xl bg-white p-5 md:p-6">
      {t && (!t.authorized || !t.visible) && (
        <p className="mb-4 rounded-2xl bg-orange-soft px-4 py-2.5 text-sm font-semibold text-[#b35f00]">
          No se publica: {!t.authorized ? "falta marcar «Autorizado por el estudiante»" : "está marcado como no visible"}.
        </p>
      )}
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        {t && <input type="hidden" name="id" value={t.id} />}
        <TextInput label="Nombre" name="name" defaultValue={t?.name} required />
        <TextInput label="Ciudad o programa" name="course" defaultValue={t?.course ?? ""} hint="Se muestra bajo el nombre (ej. Quito)" />
        <div className="md:col-span-2">
          <Label htmlFor={`course_id-${t?.id ?? "nuevo"}`}>¿Dónde se muestra?</Label>
          <select id={`course_id-${t?.id ?? "nuevo"}`} name="course_id" defaultValue={t?.course_id ?? ""} className="field">
            <option value="">Página de inicio</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                Página del programa: {c.title}
              </option>
            ))}
          </select>
        </div>
        <TextArea label="Testimonio" name="quote" defaultValue={t?.quote} rows={3} className="md:col-span-2" required />
        <div className="md:col-span-2">
          <MediaInput name="photo_url" label="Foto (opcional)" folder="testimonios" defaultValue={t?.photo_url} />
        </div>
        <Toggle name="authorized" label="Autorizado por el estudiante" hint="Sin autorización no se publica" defaultChecked={t?.authorized ?? true} />
        <Toggle name="visible" label="Visible" defaultChecked={t?.visible ?? true} />
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <input type="number" name="sort" defaultValue={t?.sort ?? 0} aria-label="Orden" className="field w-24" />
          <SubmitButton pending={pending}>{t ? "Guardar" : "Agregar testimonio"}</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>
      {t && (
        <ConfirmForm action={deleteTestimonial.bind(null, t.id)} message="¿Eliminar este testimonio?" className="mt-3">
          <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
            Eliminar
          </button>
        </ConfirmForm>
      )}
    </div>
  );
}

export function NewTestimonialEditor({ courses }: { courses: CourseOption[] }) {
  const [version, setVersion] = useState(0);
  return <TestimonialEditor key={version} courses={courses} onSaved={() => setVersion((v) => v + 1)} />;
}
