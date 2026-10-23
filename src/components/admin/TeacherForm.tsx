"use client";

import Link from "next/link";
import { saveTeacher } from "@/actions/admin/content";
import type { Teacher } from "@/lib/types";
import { MediaInput } from "./MediaInput";
import { Card, FormMessage, SubmitButton, TextArea, TextInput, Toggle, useFormAction } from "./ui";

export function TeacherForm({ teacher }: { teacher?: Teacher }) {
  const { state, onSubmit, pending } = useFormAction(saveTeacher);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {teacher && <input type="hidden" name="id" value={teacher.id} />}
      <Card title="Perfil del docente">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Nombre completo" name="name" defaultValue={teacher?.name} required />
          <TextInput label="Perfil profesional" name="headline" defaultValue={teacher?.headline ?? ""} placeholder="ej. Diseñadora UX y docente" />
          <TextInput label="Especialidad" name="specialty" defaultValue={teacher?.specialty ?? ""} />
          <TextInput label="Orden" name="sort" type="number" defaultValue={teacher?.sort ?? 0} hint="Menor = primero" />
          <TextArea label="Biografía" name="bio" defaultValue={teacher?.bio ?? ""} rows={5} className="md:col-span-2" />
          <TextArea label="Experiencia" name="experience" defaultValue={teacher?.experience ?? ""} rows={3} className="md:col-span-2" />
          <div className="md:col-span-2">
            <MediaInput name="photo_url" label="Fotografía" folder="docentes" defaultValue={teacher?.photo_url} hint="Cuadrada, mínimo 800 px" />
          </div>
          <Toggle name="visible" label="Visible en el sitio" defaultChecked={teacher?.visible ?? true} />
        </div>
      </Card>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pending={pending}>{teacher ? "Guardar cambios" : "Crear docente"}</SubmitButton>
        <Link href="/admin/docentes" className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 hover:text-navy">
          Cancelar
        </Link>
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
