"use client";

import { useEffect, useState } from "react";
import { deleteFaq, saveFaq } from "@/actions/admin/content";
import type { Faq } from "@/lib/types";
import { ConfirmForm, FormMessage, SubmitButton, TextArea, TextInput, Toggle, useFormAction } from "./ui";

export function FaqEditor({ faq, onSaved }: { faq?: Faq; onSaved?: () => void }) {
  const { state, onSubmit, pending } = useFormAction(saveFaq);

  useEffect(() => {
    if (state.ok) onSaved?.();
  }, [state, onSaved]);

  return (
    <div className="rounded-3xl bg-white p-5 md:p-6">
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_12rem]">
        {faq && <input type="hidden" name="id" value={faq.id} />}
        <TextInput label="Pregunta" name="question" defaultValue={faq?.question} required />
        <div>
          <label htmlFor={`category-${faq?.id ?? "new"}`} className="mb-1.5 block text-sm font-semibold text-navy">
            Categoría
          </label>
          <select id={`category-${faq?.id ?? "new"}`} name="category" defaultValue={faq?.category ?? "general"} className="field">
            <option value="general">General</option>
            <option value="pagos">Pagos</option>
            <option value="modalidades">Modalidades</option>
            <option value="certificados">Certificados</option>
          </select>
        </div>
        <TextArea label="Respuesta" name="answer" defaultValue={faq?.answer} rows={3} className="md:col-span-2" required />
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Toggle name="visible" label="Visible" defaultChecked={faq?.visible ?? true} />
          <input type="number" name="sort" defaultValue={faq?.sort ?? 0} aria-label="Orden" className="field w-24" />
          <SubmitButton pending={pending}>{faq ? "Guardar" : "Agregar pregunta"}</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>
      {faq && (
        <ConfirmForm action={deleteFaq.bind(null, faq.id)} message="¿Eliminar esta pregunta?" className="mt-3">
          <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
            Eliminar
          </button>
        </ConfirmForm>
      )}
    </div>
  );
}

export function NewFaqEditor() {
  const [version, setVersion] = useState(0);
  return <FaqEditor key={version} onSaved={() => setVersion((v) => v + 1)} />;
}
