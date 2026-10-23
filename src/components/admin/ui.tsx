"use client";

import { startTransition, useActionState } from "react";
import { useFormStatus } from "react-dom";

type State = { error?: string; ok?: boolean };

export function useFormAction(fn: (prev: State, fd: FormData) => Promise<State>) {
  const [state, dispatch, pending] = useActionState<State, FormData>(fn, {});
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    startTransition(() => dispatch(fd));
  }
  return { state, onSubmit, pending };
}

export function SubmitButton({
  children,
  pendingText = "Guardando…",
  className = "",
  pending: forced,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = forced ?? status.pending;
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange disabled:opacity-60 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function ConfirmForm({
  action,
  message,
  children,
  className,
}: {
  action: () => Promise<void>;
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </form>
  );
}

export function Label({ children, hint, htmlFor }: { children: React.ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy">
      {children}
      {hint && <span className="ml-2 text-xs font-normal text-ink/45">{hint}</span>}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string };

export function TextInput({ label, hint, id, name, className = "", ...props }: InputProps) {
  const fieldId = id ?? name;
  return (
    <div className={className}>
      <Label htmlFor={fieldId} hint={hint}>
        {label}
      </Label>
      <input id={fieldId} name={name} className="field" {...props} />
    </div>
  );
}

type AreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string };

export function TextArea({ label, hint, id, name, className = "", rows = 4, ...props }: AreaProps) {
  const fieldId = id ?? name;
  return (
    <div className={className}>
      <Label htmlFor={fieldId} hint={hint}>
        {label}
      </Label>
      <textarea id={fieldId} name={name} rows={rows} className="field resize-y" {...props} />
    </div>
  );
}

export function Toggle({ name, label, defaultChecked, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-paper px-4 py-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-orange peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-orange" />
      <span className="text-sm">
        <span className="font-semibold text-navy">{label}</span>
        {hint && <span className="block text-xs text-ink/50">{hint}</span>}
      </span>
    </label>
  );
}

export function Card({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 md:p-7">
      {title && <h2 className="text-lg font-bold text-navy">{title}</h2>}
      {description && <p className="mt-1 text-sm text-ink/55">{description}</p>}
      <div className={title || description ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

export function FormMessage({ state }: { state: { error?: string; ok?: boolean } }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {state.error}
      </p>
    );
  if (state.ok)
    return (
      <p role="status" className="rounded-2xl bg-whatsapp/10 px-4 py-3 text-sm text-ink/80">
        Cambios guardados.
      </p>
    );
  return null;
}
