"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { notifyAcademy } from "@/lib/notify";
import { serviceClient } from "@/lib/supabase/service";
import { RECEIPT_MAX_BYTES, RECEIPT_TYPES, extensionFor } from "@/lib/uploads";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Record<string, string>; values?: Record<string, string> }
  | { status: "success"; id: string; token: string; courseTitle: string | null };

const MIN_FILL_MS = 2500;

const schema = z.object({
  kind: z.enum(["consulta", "reserva"]),
  full_name: z.string().trim().min(3, "Escribe tu nombre completo.").max(120),
  email: z.email("Revisa el correo electrónico.").trim().max(160),
  phone: z
    .string()
    .trim()
    .min(8, "Revisa el número de teléfono.")
    .max(25)
    .regex(/^[+\d\s()-]+$/, "Revisa el número de teléfono."),
  course_id: z.uuid().optional().or(z.literal("").transform(() => undefined)),
  message: z.string().trim().max(2000).optional(),
  privacy: z.literal("on", { error: "Debes aceptar el aviso de privacidad." }),
});

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const startedAt = Number(formData.get("started_at"));
  if (formData.get("website") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: "No pudimos enviar el formulario. Intenta de nuevo en unos segundos." };
  }

  const raw = Object.fromEntries(formData);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const values: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) if (typeof value === "string") values[key] = value;
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fields[key] ??= issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", fields, values };
  }

  const input = parsed.data;
  const db = serviceClient();

  let courseTitle: string | null = null;
  if (input.course_id) {
    const { data } = await db.from("courses").select("title").eq("id", input.course_id).eq("visible", true).maybeSingle();
    courseTitle = data?.title ?? null;
  }

  const { data, error } = await db
    .from("inquiries")
    .insert({
      kind: input.kind,
      full_name: input.full_name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      course_id: courseTitle ? input.course_id : null,
      course_title: courseTitle,
      message: input.message || null,
      privacy_accepted_at: new Date().toISOString(),
    })
    .select("id, upload_token")
    .single();

  if (error || !data) {
    console.error("submitInquiry", error?.message);
    return { status: "error", message: "No pudimos registrar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp." };
  }

  await notifyAcademy({
    subject: `Nueva ${input.kind === "reserva" ? "solicitud de reserva" : "consulta"}: ${input.full_name}`,
    lines: [
      ["Nombre", input.full_name],
      ["Correo", input.email],
      ["Teléfono", input.phone],
      ["Programa", courseTitle],
      ["Mensaje", input.message],
    ],
  });

  return { status: "success", id: data.id, token: data.upload_token, courseTitle };
}

async function findInquiry(id: string, token: string) {
  if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(token).success) return null;
  const { data } = await serviceClient()
    .from("inquiries")
    .select("id, full_name, course_title, payment_status")
    .eq("id", id)
    .eq("upload_token", token)
    .maybeSingle();
  return data;
}

export async function requestReceiptUpload(input: { id: string; token: string; type: string; size: number }) {
  const inquiry = await findInquiry(input.id, input.token);
  if (!inquiry) return { error: "No encontramos tu solicitud." };
  if (inquiry.payment_status === "aprobado") return { error: "Tu pago ya fue aprobado." };
  if (!RECEIPT_TYPES.includes(input.type)) return { error: "Sube una imagen (JPG, PNG, WEBP) o un PDF." };
  if (input.size > RECEIPT_MAX_BYTES) return { error: "El archivo supera los 8 MB." };

  const path = `${inquiry.id}/${randomUUID()}.${extensionFor(input.type)}`;
  const { data, error } = await serviceClient().storage.from("receipts").createSignedUploadUrl(path);
  if (error || !data) return { error: "No pudimos preparar la carga. Intenta de nuevo." };
  return { path: data.path, uploadToken: data.token };
}

export async function confirmReceipt(input: { id: string; token: string; path: string }) {
  const inquiry = await findInquiry(input.id, input.token);
  if (!inquiry) return { error: "No encontramos tu solicitud." };

  const [folder, file] = input.path.split("/");
  if (folder !== inquiry.id || !file || input.path.split("/").length !== 2) return { error: "Archivo no válido." };

  const db = serviceClient();
  const { data: files } = await db.storage.from("receipts").list(inquiry.id, { search: file });
  if (!files?.some((f) => f.name === file)) return { error: "No encontramos el archivo subido." };

  const { error } = await db
    .from("inquiries")
    .update({ receipt_path: input.path, payment_status: "en_revision" })
    .eq("id", inquiry.id);
  if (error) return { error: "No pudimos registrar el comprobante." };

  await notifyAcademy({
    subject: `Comprobante recibido: ${inquiry.full_name}`,
    lines: [
      ["Nombre", inquiry.full_name],
      ["Programa", inquiry.course_title],
      ["Estado", "Pendiente de revisión en el panel"],
    ],
  });

  return { ok: true as const };
}
