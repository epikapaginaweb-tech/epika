"use client";

import { login } from "@/actions/admin/session";
import { SubmitButton, TextInput, useFormAction } from "./ui";

export function LoginForm() {
  const { state, onSubmit, pending } = useFormAction(login);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <TextInput label="Usuario" name="username" autoComplete="username" required />
      <TextInput label="Contraseña" name="password" type="password" autoComplete="current-password" required />
      {state.error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton pending={pending} pendingText="Verificando…" className="w-full py-3.5">
        Ingresar
      </SubmitButton>
    </form>
  );
}
