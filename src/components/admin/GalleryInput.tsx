"use client";

import { useState } from "react";
import { Label } from "./ui";
import { uploadMedia } from "./upload";

export function GalleryInput({ name, label, defaultValue }: { name: string; label: string; defaultValue: string[] }) {
  const [images, setImages] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList) {
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadMedia(file, "galeria"));
      setImages((prev) => [...prev, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label hint="Se muestran en la página Nosotros">{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => setImages(images.filter((_, j) => j !== i))}
              className="absolute right-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-red-600"
              aria-label="Quitar imagen"
            >
              ✕
            </button>
          </div>
        ))}
        <label className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line text-xs font-semibold text-navy hover:border-orange ${busy ? "pointer-events-none opacity-60" : ""}`}>
          <span className="text-2xl">+</span>
          {busy ? "Subiendo…" : "Agregar"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) onFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
