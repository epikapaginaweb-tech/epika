"use client";

import Link from "next/link";
import { saveCourse } from "@/actions/admin/content";
import { MODALITY_LABEL } from "@/lib/format";
import { MODALITIES, type Course } from "@/lib/types";
import { MediaInput } from "./MediaInput";
import { Repeater } from "./Repeater";
import { Card, FormMessage, Label, SubmitButton, TextArea, TextInput, Toggle, useFormAction } from "./ui";

type Props = {
  course?: Course;
  teachers: { id: string; name: string }[];
};

const join = (list?: string[]) => (list ?? []).join("\n");

export function CourseForm({ course, teachers }: Props) {
  const { state, onSubmit, pending } = useFormAction(saveCourse);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {course && <input type="hidden" name="id" value={course.id} />}

      <Card title="Información principal">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Nombre del programa" name="title" defaultValue={course?.title} required className="md:col-span-2" />
          <TextInput label="Enlace" name="slug" defaultValue={course?.slug} hint="Se genera del nombre si lo dejas vacío" placeholder="ej. marketing-digital" />
          <div>
            <Label htmlFor="modality">Modalidad</Label>
            <select id="modality" name="modality" defaultValue={course?.modality ?? "virtual"} className="field">
              {MODALITIES.map((m) => (
                <option key={m} value={m}>
                  {MODALITY_LABEL[m]}
                </option>
              ))}
            </select>
          </div>
          <TextArea label="Descripción breve" name="short_description" defaultValue={course?.short_description ?? ""} rows={2} hint="Aparece en la tarjeta del catálogo" className="md:col-span-2" />
          <TextArea label="Resumen" name="summary" defaultValue={course?.summary ?? ""} rows={4} className="md:col-span-2" />
          <div className="md:col-span-2">
            <MediaInput name="image_url" label="Imagen del curso" folder="cursos" defaultValue={course?.image_url} hint="Vertical u horizontal, mínimo 1200 px" />
          </div>
        </div>
      </Card>

      <Card title="Contenido académico">
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea label="Objetivos de aprendizaje" name="objectives" defaultValue={join(course?.objectives)} hint="Uno por línea" rows={5} />
          <TextArea label="Requisitos" name="requirements" defaultValue={join(course?.requirements)} hint="Uno por línea" rows={5} />
          <TextArea label="¿A quién está dirigido?" name="audience" defaultValue={course?.audience ?? ""} rows={3} className="md:col-span-2" />
          <div className="md:col-span-2">
            <Repeater
              name="modules"
              label="Temario / módulos"
              addLabel="Agregar módulo"
              defaultValue={course?.modules ?? []}
              fields={[
                { key: "title", label: "Título del módulo" },
                { key: "description", label: "Descripción", multiline: true },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card title="Instructor, fechas y horario">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="teacher_id">Instructor</Label>
            <select id="teacher_id" name="teacher_id" defaultValue={course?.teacher_id ?? ""} className="field">
              <option value="">Sin asignar</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <TextInput label="Fecha de inicio" name="start_date" type="date" defaultValue={course?.start_date ?? ""} />
          <TextInput label="Duración" name="duration" defaultValue={course?.duration ?? ""} placeholder="ej. 8 semanas · 24 horas" />
          <TextInput label="Horario" name="schedule" defaultValue={course?.schedule ?? ""} placeholder="ej. Sábados 9:00 a.m. – 12:00 m.d." />
        </div>
      </Card>

      <Card title="Inversión y certificado">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Precio" name="price" inputMode="decimal" defaultValue={course?.price ?? ""} placeholder="ej. 85000" />
          <div>
            <Label htmlFor="currency">Moneda</Label>
            <select id="currency" name="currency" defaultValue={course?.currency ?? "CRC"} className="field">
              <option value="CRC">Colones (₡)</option>
              <option value="USD">Dólares ($)</option>
            </select>
          </div>
          <TextArea label="Formas de pago" name="payment_methods" defaultValue={join(course?.payment_methods)} hint="Una por línea" rows={4} />
          <TextArea label="Qué incluye" name="includes" defaultValue={join(course?.includes)} hint="Uno por línea" rows={4} />
          <TextArea label="Certificado" name="certificate" defaultValue={course?.certificate ?? ""} rows={3} hint="Déjalo vacío si no aplica" className="md:col-span-2" />
        </div>
      </Card>

      <Card title="Brief del programa" description="Documento PDF con la información completa del programa.">
        <div className="grid gap-4 md:grid-cols-2">
          <MediaInput name="brief_url" label="Archivo PDF" folder="briefs" kind="pdf" defaultValue={course?.brief_url} />
          <div className="self-end">
            <Toggle name="brief_public" label="Permitir descarga pública" hint="Muestra el botón en la página del programa" defaultChecked={course?.brief_public} />
          </div>
        </div>
      </Card>

      <Card title="Publicación">
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle name="visible" label="Visible en el sitio" hint="Si está apagado, el programa queda oculto" defaultChecked={course?.visible ?? false} />
          <Toggle name="featured" label="Destacado" hint="Aparece primero en el inicio" defaultChecked={course?.featured} />
          <TextInput label="Orden" name="sort" type="number" defaultValue={course?.sort ?? 0} hint="Menor = primero" />
        </div>
      </Card>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-3xl bg-white/90 p-4 shadow-lg backdrop-blur">
        <SubmitButton pending={pending}>{course ? "Guardar cambios" : "Crear programa"}</SubmitButton>
        <Link href="/admin/programas" className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 hover:text-navy">
          Cancelar
        </Link>
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
