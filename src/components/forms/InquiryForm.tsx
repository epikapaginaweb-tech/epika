"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { submitInquiry, type InquiryState } from "@/actions/inquiry";
import { Confetti } from "@/components/motion/Confetti";
import { EASE_OUT } from "@/components/motion/ease";
import { WhatsAppIcon } from "@/components/site/icons";
import type { BankAccount } from "@/lib/types";
import { BankAccounts } from "./BankAccounts";
import { ReceiptUpload } from "./ReceiptUpload";

export const CONFIRMATION =
  "Recibimos tu solicitud. Nuestro equipo te contactará para confirmar disponibilidad y explicarte cómo completar tu inscripción.";

type Props = {
  kind: "consulta" | "reserva";
  courses: { id: string; title: string }[];
  defaultCourseId?: string;
  bankAccounts: BankAccount[];
  paymentNote: string;
  whatsappHref: string;
};

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
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

function PaymentStep({ state, bankAccounts, paymentNote, whatsappHref }: { state: Extract<InquiryState, { status: "success" }> } & Omit<Props, "kind" | "courses" | "defaultCourseId">) {
  const showPayment = Boolean(state.courseTitle);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className="space-y-8"
      role="status"
    >
      <div className="relative rounded-[1.5rem] bg-navy p-7 text-white">
        <Confetti />
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
          className="flex size-12 items-center justify-center rounded-full bg-orange text-2xl"
          aria-hidden
        >
          ✓
        </motion.span>
        <p className="mt-5 text-xl font-bold leading-snug">{CONFIRMATION}</p>
        {state.courseTitle && <p className="mt-3 text-sm text-white/60">Programa: {state.courseTitle}</p>}
      </div>

      {showPayment && (
        <div className="space-y-5">
          <div>
            <p className="eyebrow">Adelanta tu pago</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{paymentNote}</p>
          </div>
          {bankAccounts.length > 0 ? (
            <BankAccounts accounts={bankAccounts} />
          ) : (
            <p className="rounded-2xl bg-paper p-5 text-sm text-ink/65">Te compartiremos los datos de pago al confirmar tu cupo.</p>
          )}
          <ReceiptUpload id={state.id} token={state.token} />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-whatsapp"
          >
            <WhatsAppIcon className="size-4" /> ¿Prefieres enviarlo por WhatsApp?
          </a>
        </div>
      )}
    </motion.div>
  );
}

export function InquiryForm({ kind, courses, defaultCourseId, bankAccounts, paymentNote, whatsappHref }: Props) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const startedAt = useRef(0);
  const errors = state.status === "error" ? state.fields ?? {} : {};
  const values = state.status === "error" ? state.values ?? {} : {};

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function submit(formData: FormData) {
    formData.set("started_at", String(startedAt.current));
    action(formData);
  }

  return (
    <AnimatePresence mode="wait">
      {state.status === "success" ? (
        <PaymentStep key="done" state={state} bankAccounts={bankAccounts} paymentNote={paymentNote} whatsappHref={whatsappHref} />
      ) : (
        <motion.form key="form" action={submit} exit={{ opacity: 0, y: -20 }} className="space-y-5" noValidate>
          <input type="hidden" name="kind" value={kind} />
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Sitio web
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <Field label="Nombre completo" name="full_name" error={errors.full_name}>
            <input
              id="full_name"
              name="full_name"
              defaultValue={values.full_name}
              autoComplete="name"
              required
              className="field"
              aria-invalid={Boolean(errors.full_name)}
              aria-describedby={errors.full_name ? "full_name-error" : undefined}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Correo electrónico" name="email" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={values.email}
                autoComplete="email"
                required
                className="field"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </Field>
            <Field label="Número de teléfono" name="phone" error={errors.phone}>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={values.phone}
                autoComplete="tel"
                inputMode="tel"
                required
                className="field"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </Field>
          </div>

          <Field label="Programa de interés" name="course_id" error={errors.course_id}>
            <select id="course_id" name="course_id" defaultValue={values.course_id ?? defaultCourseId ?? ""} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23002952%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10">
              <option value="">{courses.length ? "Selecciona un programa (opcional)" : "Aún no hay programas publicados"}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Mensaje o consulta" name="message" error={errors.message}>
            <textarea id="message" name="message" defaultValue={values.message} rows={4} maxLength={2000} className="field resize-y" />
          </Field>

          <div>
            <label className="flex items-start gap-3 text-sm text-ink/70">
              <input
                type="checkbox"
                name="privacy"
                defaultChecked={values.privacy === "on"}
                required
                className="mt-0.5 size-5 shrink-0 rounded accent-navy"
                aria-invalid={Boolean(errors.privacy)}
              />
              <span>
                Acepto el{" "}
                <Link href="/privacidad" target="_blank" className="font-semibold text-navy font-script text-[1.3em] hover:text-orange">
                  aviso de privacidad
                </Link>
                .
              </span>
            </label>
            {errors.privacy && <p className="mt-1.5 text-xs text-red-600">{errors.privacy}</p>}
          </div>

          {state.status === "error" && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-orange disabled:opacity-60 sm:w-auto"
          >
            {pending ? "Enviando…" : kind === "reserva" ? "Solicitar reserva" : "Enviar consulta"}
            {!pending && <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
