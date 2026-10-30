"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { submitEnrollment, type InquiryState } from "@/actions/inquiry";
import { WhatsAppIcon } from "@/components/site/icons";
import type { BankAccount } from "@/lib/types";
import { BankAccounts } from "./BankAccounts";
import { ReceiptUpload } from "./ReceiptUpload";

const EDUCATION = ["Bachillerato", "Tecnología", "Tercer nivel", "Cuarto nivel", "Otro"];

export type OrderSummary = {
  title: string;
  image: string | null;
  kind: string;
  modality: string | null;
  start: string | null;
  duration: string | null;
  price: string | null;
  credit: string | null;
};

type Props = {
  courseId: string;
  courseTitle: string;
  summary: OrderSummary;
  bankAccounts: BankAccount[];
  thanks: { title: string; text: string };
  whatsappHref: string;
};

function Field({ label, name, error, required, children }: { label: string; name: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Ventana emergente al terminar la inscripción. */
// Convierte *texto* en negrita y respeta los saltos de línea.
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <strong key={i} className="font-bold text-navy">
            {part.slice(1, -1)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function ThanksModal({ kind, courseTitle, thanks, whatsappHref, onClose }: { kind: "receipt" | "later"; courseTitle: string; thanks: { title: string; text: string }; whatsappHref: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/60 p-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thanks-title"
        className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p id="thanks-title" className="bolder text-3xl font-bold text-navy">
          {kind === "receipt" ? thanks.title || "¡Gracias por tu compra!" : "¡Gracias por tu inscripción!"}
        </p>
        <p className="mt-4 whitespace-pre-line text-left text-sm leading-relaxed text-ink/75">
          {kind === "receipt" ? (
            <RichText text={thanks.text} />
          ) : (
            `Registramos tus datos para «${courseTitle}». Cuando realices la transferencia, envíanos el comprobante por WhatsApp y te enviaremos tus credenciales institucionales para acceder al campus virtual.`
          )}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-go px-5 py-3 text-sm font-bold text-white">
            <WhatsAppIcon className="size-4" /> Escribir por WhatsApp
          </a>
          <Link href="/" className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Formulario de inscripción → pago por transferencia → comprobante → ventana de confirmación. */
/** Resumen tipo carrito: lo que estás pagando, justo arriba del método de pago. */
function Cart({ summary }: { summary: OrderSummary }) {
  const details = [summary.kind, summary.modality, summary.start && `Inicia ${summary.start}`, summary.duration].filter(Boolean) as string[];
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Tu pedido</p>
      <div className="mt-3 flex gap-3">
        {summary.image && (
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-navy">
            <Image src={summary.image} alt="" fill sizes="64px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-snug text-navy">{summary.title}</p>
          {details.length > 0 && <p className="mt-1 text-xs leading-relaxed text-ink/60">{details.join(" · ")}</p>}
        </div>
      </div>
      <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm">
        {summary.price && (
          <div className="flex items-center justify-between">
            <span className="text-ink/60">Plan contado</span>
            <span className="font-semibold text-navy">{summary.price}</span>
          </div>
        )}
        {summary.credit && (
          <div className="flex items-center justify-between">
            <span className="text-ink/60">Plan crédito</span>
            <span className="font-semibold text-navy">{summary.credit}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-navy">Total a pagar</span>
          <span className="text-xl font-bold text-orange">{summary.price ?? "Por confirmar"}</span>
        </div>
      </div>
    </div>
  );
}

export function EnrollmentForm({ courseId, courseTitle, summary, bankAccounts, thanks, whatsappHref }: Props) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitEnrollment, { status: "idle" });
  const [startedAt, setStartedAt] = useState(0);
  const [modal, setModal] = useState<"receipt" | "later" | null>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "success") paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.status]);

  const errors = state.status === "error" ? (state.fields ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const done = state.status === "success";

  const input = (name: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      id={name}
      name={name}
      defaultValue={values[name]}
      className="field"
      disabled={done}
      aria-invalid={Boolean(errors[name])}
      aria-describedby={errors[name] ? `${name}-error` : undefined}
      {...extra}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      {/* 1. Datos */}
      <div className="rounded-[2rem] bg-white p-6 md:p-9">
        <p className="text-lg font-bold text-navy">1. Completa tu información</p>
        <p className="mt-1 text-sm text-ink/55">Completa correctamente tus datos, se usarán para emitir tu certificado.</p>

        <form action={action} className="mt-6 grid gap-5" noValidate>
          <input type="hidden" name="course_id" value={courseId} />
          <input type="hidden" name="started_at" value={startedAt} />
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Sitio web
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombres" name="first_name" error={errors.first_name} required>
              {input("first_name", { autoComplete: "given-name", required: true })}
            </Field>
            <Field label="Apellidos" name="last_name" error={errors.last_name} required>
              {input("last_name", { autoComplete: "family-name", required: true })}
            </Field>
            <Field label="Cédula de identidad" name="cedula" error={errors.cedula} required>
              {input("cedula", { inputMode: "numeric", required: true })}
            </Field>
            <Field label="Email" name="email" error={errors.email} required>
              {input("email", { type: "email", autoComplete: "email", required: true })}
            </Field>
            <Field label="Fecha de nacimiento" name="birth_date" error={errors.birth_date}>
              {input("birth_date", { type: "date", autoComplete: "bday" })}
            </Field>
            <Field label="Formación académica" name="education" error={errors.education}>
              <select id="education" name="education" defaultValue={values.education ?? ""} className="field" disabled={done}>
                <option value="">Selecciona</option>
                {EDUCATION.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Celular" name="phone" error={errors.phone} required>
              <div className="flex items-center gap-2">
                <span className="flex h-[3.1rem] shrink-0 items-center gap-1.5 rounded-2xl border border-line bg-paper px-3 text-sm font-semibold text-navy" aria-hidden>
                  <span className="relative size-4 overflow-hidden rounded-full">
                    <span className="absolute inset-x-0 top-0 h-1/2 bg-[#ffdd00]" />
                    <span className="absolute inset-x-0 top-1/2 h-1/4 bg-[#034ea2]" />
                    <span className="absolute inset-x-0 bottom-0 h-1/4 bg-[#ed1c24]" />
                  </span>
                  +593
                </span>
                {input("phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "099 123 4567", required: true })}
              </div>
            </Field>
            <Field label="Ciudad" name="city" error={errors.city} required>
              {input("city", { autoComplete: "address-level2", required: true })}
            </Field>
          </div>
          <Field label="Dirección de domicilio" name="address" error={errors.address}>
            {input("address", { autoComplete: "street-address" })}
          </Field>

          <label className="flex items-start gap-3 text-xs leading-relaxed text-ink/65">
            <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-[#0d284f]" disabled={done} defaultChecked={values.consent === "on"} />
            <span>
              Autorizo recibir información de Épika Academy por medio de WhatsApp, llamadas, SMS y correo electrónico, y acepto el{" "}
              <Link href="/privacidad" target="_blank" className="font-semibold text-orange hover:underline">
                aviso de privacidad
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p className="-mt-3 text-xs text-red-600">{errors.consent}</p>}

          {state.status === "error" && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </p>
          )}

          {!done && (
            <button type="submit" disabled={pending || !startedAt} className="rounded-full bg-navy px-7 py-3.5 text-sm font-bold text-white transition-opacity disabled:opacity-60">
              {pending ? "Enviando…" : "Continuar al pago"}
            </button>
          )}
          {done && <p className="rounded-2xl bg-go/10 px-4 py-3 text-sm font-semibold text-navy">Datos registrados ✓ Ahora completa el pago.</p>}
        </form>
      </div>

      {/* 2. Pago por transferencia */}
      <div ref={paymentRef} className="scroll-mt-24">
        <div className={`rounded-[2rem] bg-white p-6 transition-opacity md:p-9 ${done ? "" : "opacity-60"}`}>
          <p className="text-lg font-bold text-navy">2. Realiza el pago</p>
          <div className="mt-4">
            <Cart summary={summary} />
          </div>
          <p className="mt-6 text-sm font-semibold text-navy">Método de pago: transferencia bancaria</p>
          <div className="mt-3">
            {bankAccounts.length > 0 ? (
              <BankAccounts accounts={bankAccounts} />
            ) : (
              <p className="rounded-2xl bg-paper p-4 text-sm text-ink/65">Te compartiremos los datos de pago por WhatsApp.</p>
            )}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-navy">Sube la foto del comprobante</p>
            {done ? (
              <ReceiptUpload id={state.id} token={state.token} onDone={() => setModal("receipt")} />
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-line px-5 py-6 text-center text-sm text-ink/50">Primero completa tus datos.</p>
            )}
          </div>
          {done && (
            <button type="button" onClick={() => setModal("later")} className="mt-4 text-sm font-semibold text-navy underline-offset-4 hover:underline">
              Enviaré el comprobante después
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && <ThanksModal kind={modal} courseTitle={courseTitle} thanks={thanks} whatsappHref={whatsappHref} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
