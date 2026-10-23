"use client";

import { requestMediaUpload } from "@/actions/admin/content";
import { browserClient } from "@/lib/supabase/browser";

export async function uploadMedia(file: File, folder: string) {
  const ticket = await requestMediaUpload({ folder, type: file.type, size: file.size });
  if ("error" in ticket) throw new Error(ticket.error);
  const { error } = await browserClient()
    .storage.from("media")
    .uploadToSignedUrl(ticket.path, ticket.uploadToken, file, { contentType: file.type });
  if (error) throw new Error("No se pudo subir el archivo.");
  return ticket.publicUrl;
}
