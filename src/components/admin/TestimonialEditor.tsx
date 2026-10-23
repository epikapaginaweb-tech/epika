"use client";

import { useEffect, useState } from "react";
import { deleteTestimonial, saveTestimonial } from "@/actions/admin/content";
import type { Testimonial } from "@/lib/types";
import { MediaInput } from "./MediaInput";
import { ConfirmForm, FormMessage, SubmitButton, TextArea, TextInput, Toggle, useFormAction } from "./ui";

export function TestimonialEditor({ testimonial, onSaved }: { testimonial?: Testimonial; onSaved?: () => void }) {
  const { state, onSubmit, pending } = useFormAction(saveTestimonial);

  useEffect(() => {
    if (state.ok) onSaved?.();
  }, [state, onSaved]);
  const t = testimonial;

  return (
    <div className="rounded-3xl bg-white p-5 md:p-6">
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
        {t && <input type="hidden" name="id" value={t.id} />}
        <TextInput label="Nombre" name="name" defaultValue={t?.name} required />
        <TextInput label="Curso" name="course" defaultValue={t?.course ?? ""} />
        <TextArea label="Testimonio" name="quote" defaultValue={t?.quote} rows={3} className="md:col-span-2" required />
        <div className="md:col-span-2">
          <MediaInput name="photo_url" label="Foto (opcional)" folder="testimonios" defaultValue={t?.photo_url} />
        </div>
        <Toggle name="authorized" label="Autorizado por el estudiante" hint="Sin autorización no se publica" defaultChecked={t?.authorized} />
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

export function NewTestimonialEditor() {
  const [version, setVersion] = useState(0);
  return <TestimonialEditor key={version} onSaved={() => setVersion((v) => v + 1)} />;
}
