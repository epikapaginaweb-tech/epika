"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { buildUsername, cleanCedula } from "@/lib/credentials";
import { serviceClient } from "@/lib/supabase/service";
import { INQUIRY_STATUSES, PAYMENT_STATUSES, type InquiryStatus, type PaymentStatus } from "@/lib/types";

function refresh(id: string) {
  revalidatePath("/admin", "layout");
  revalidatePath(`/admin/solicitudes/${id}`);
}

export async function updateInquiry(id: string, fd: FormData) {
  await requireAdmin();
  const status = String(fd.get("status") ?? "");
  const notes = String(fd.get("notes") ?? "").trim() || null;
  if (!INQUIRY_STATUSES.includes(status as InquiryStatus)) return;
  await serviceClient().from("inquiries").update({ status, notes }).eq("id", id);
  refresh(id);
}

export async function setPaymentStatus(id: string, paymentStatus: PaymentStatus) {
  await requireAdmin();
  if (!PAYMENT_STATUSES.includes(paymentStatus)) return;
  const patch: Record<string, string> = { payment_status: paymentStatus };
  if (paymentStatus === "aprobado") patch.status = "inscrita";
  await serviceClient().from("inquiries").update(patch).eq("id", id);
  refresh(id);
}

export async function saveCredentials(input: { id: string; firstName: string; lastName: string; cedula: string }) {
  await requireAdmin();
  const cedula = cleanCedula(input.cedula);
  const username = buildUsername(input.firstName, input.lastName);
  if (!cedula || !username) return { error: "Completa nombre, apellido y cédula." };

  const { error } = await serviceClient()
    .from("inquiries")
    .update({ cedula, username, credentials_sent_at: new Date().toISOString() })
    .eq("id", input.id);
  if (error) return { error: "No se pudieron guardar las credenciales." };
  refresh(input.id);
  return { ok: true as const };
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  const db = serviceClient();
  const { data: files } = await db.storage.from("receipts").list(id);
  if (files?.length) await db.storage.from("receipts").remove(files.map((f) => `${id}/${f.name}`));
  await db.from("inquiries").delete().eq("id", id);
  revalidatePath("/admin", "layout");
  redirect("/admin/solicitudes");
}
