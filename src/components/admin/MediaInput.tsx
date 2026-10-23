"use client";

import { useState } from "react";
import { Label } from "./ui";
import { uploadMedia } from "./upload";

type Props = {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string | null;
  kind?: "image" | "pdf";
  hint?: string;
};

const ACCEPT = { image: "image/jpeg,image/png,image/webp,image/avif", pdf: "application/pdf" };

export function MediaInput({ name, label, folder, defaultValue, kind = "image", hint }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      setUrl(await uploadMedia(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir el archivo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-3">
        {kind === "image" ? (
          <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-white">
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" className="size-full object-cover" />
            )}
          </div>
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-orange">PDF</div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-ink/55 underline">
              {url.split("/").pop()}
            </a>
          ) : (
            <p className="text-xs text-ink/45">Sin archivo</p>
          )}
          <div className="flex flex-wrap gap-2">
            <label className={`cursor-pointer rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-orange ${busy ? "pointer-events-none opacity-60" : ""}`}>
              {busy ? "Subiendo…" : url ? "Reemplazar" : "Subir archivo"}
              <input
                type="file"
                accept={ACCEPT[kind]}
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFile(file);
                  e.target.value = "";
                }}
              />
            </label>
            {url && (
              <button type="button" onClick={() => setUrl("")} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-red-600">
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
