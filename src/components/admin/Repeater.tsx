"use client";

import { useState } from "react";
import { Label } from "./ui";

type FieldDef = { key: string; label: string; multiline?: boolean };
type Row = Record<string, string>;

type Props = {
  name: string;
  label: string;
  fields: FieldDef[];
  defaultValue: Row[];
  addLabel?: string;
  hint?: string;
};

export function Repeater({ name, label, fields, defaultValue, addLabel = "Agregar", hint }: Props) {
  const [rows, setRows] = useState<Row[]>(defaultValue.length ? defaultValue : []);
  const empty = Object.fromEntries(fields.map((f) => [f.key, ""]));

  function update(index: number, key: string, value: string) {
    setRows(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
  }

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="rounded-2xl border border-line bg-paper p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-orange">#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded-full bg-white px-2.5 py-1 text-xs" aria-label="Subir">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} className="rounded-full bg-white px-2.5 py-1 text-xs" aria-label="Bajar">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setRows(rows.filter((_, j) => j !== i))}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-600"
                >
                  Quitar
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
                  <span className="mb-1 block text-xs font-semibold text-ink/60">{field.label}</span>
                  {field.multiline ? (
                    <textarea value={row[field.key] ?? ""} onChange={(e) => update(i, field.key, e.target.value)} rows={2} className="field resize-y" />
                  ) : (
                    <input value={row[field.key] ?? ""} onChange={(e) => update(i, field.key, e.target.value)} className="field" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRows([...rows, { ...empty }])}
          className="w-full rounded-2xl border-2 border-dashed border-line py-3 text-sm font-semibold text-navy transition-colors hover:border-orange hover:text-orange"
        >
          + {addLabel}
        </button>
      </div>
    </div>
  );
}
