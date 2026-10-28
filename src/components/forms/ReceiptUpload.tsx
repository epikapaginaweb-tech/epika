"use client";

import { useState } from "react";
import { confirmReceipt, requestReceiptUpload } from "@/actions/inquiry";
import { browserClient } from "@/lib/supabase/browser";
import { RECEIPT_MAX_BYTES, RECEIPT_TYPES } from "@/lib/uploads";

type Status = { kind: "idle" } | { kind: "uploading" } | { kind: "done"; name: string } | { kind: "error"; message: string };

export function ReceiptUpload({ id, token, onDone }: { id: string; token: string; onDone?: () => void }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    if (!RECEIPT_TYPES.includes(file.type)) return setStatus({ kind: "error", message: "Sube una imagen (JPG, PNG, WEBP) o un PDF." });
    if (file.size > RECEIPT_MAX_BYTES) return setStatus({ kind: "error", message: "El archivo supera los 8 MB." });

    setStatus({ kind: "uploading" });
    const ticket = await requestReceiptUpload({ id, token, type: file.type, size: file.size });
    if ("error" in ticket) return setStatus({ kind: "error", message: ticket.error ?? "No pudimos subir el archivo." });

    const { error } = await browserClient()
      .storage.from("receipts")
      .uploadToSignedUrl(ticket.path, ticket.uploadToken, file, { contentType: file.type });
    if (error) return setStatus({ kind: "error", message: "No pudimos subir el archivo. Intenta de nuevo." });

    const result = await confirmReceipt({ id, token, path: ticket.path });
    if ("error" in result) return setStatus({ kind: "error", message: result.error ?? "No pudimos registrar el comprobante." });
    setStatus({ kind: "done", name: file.name });
    onDone?.();
  }

  if (status.kind === "done") {
    return (
      <div className="rounded-2xl bg-whatsapp/10 p-5 text-sm text-ink/80">
        <p className="font-semibold text-navy">Comprobante recibido ✓</p>
        <p className="mt-1">
          «{status.name}» quedó en revisión. Te avisaremos cuando confirmemos el pago.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) upload(file);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging ? "border-orange bg-orange-soft/50" : "border-line bg-paper hover:border-navy/40"
        } ${status.kind === "uploading" ? "pointer-events-none opacity-60" : ""}`}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-white text-xl text-orange shadow-sm" aria-hidden>
          ↑
        </span>
        <span className="font-semibold text-navy">{status.kind === "uploading" ? "Subiendo comprobante…" : "Subir comprobante de pago"}</span>
        <span className="text-xs text-ink/50">JPG, PNG, WEBP o PDF · máximo 8 MB</span>
        <input
          type="file"
          accept={RECEIPT_TYPES.join(",")}
          className="sr-only"
          disabled={status.kind === "uploading"}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </label>
      {status.kind === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {status.message}
        </p>
      )}
    </div>
  );
}
