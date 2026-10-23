"use client";

import { useState, useTransition } from "react";
import { saveCredentials } from "@/actions/admin/inquiries";
import { WhatsAppIcon } from "@/components/site/icons";
import { buildPassword, buildUsername, credentialsMessage, splitName } from "@/lib/credentials";
import { formatDate } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { Label } from "./ui";

type Props = {
  id: string;
  fullName: string;
  phone: string;
  courseTitle: string | null;
  cedula: string | null;
  countryCode: string;
  sentAt: string | null;
  paymentApproved: boolean;
};

export function CredentialsPanel({ id, fullName, phone, courseTitle, cedula: savedCedula, countryCode, sentAt, paymentApproved }: Props) {
  const guess = splitName(fullName);
  const [firstName, setFirstName] = useState(guess.firstName);
  const [lastName, setLastName] = useState(guess.lastName);
  const [cedula, setCedula] = useState(savedCedula ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const username = buildUsername(firstName, lastName);
  const password = buildPassword(cedula);
  const ready = Boolean(username && password);
  const message = credentialsMessage({ firstName: firstName.trim(), courseTitle, username, password });
  const href = whatsappUrl(phone, message, countryCode);

  function register() {
    setError("");
    startTransition(async () => {
      const result = await saveCredentials({ id, firstName, lastName, cedula });
      if ("error" in result) setError(result.error ?? "");
    });
  }

  return (
    <div className="space-y-4">
      {!paymentApproved && (
        <p className="rounded-2xl bg-orange-soft px-4 py-3 text-sm text-ink/80">El pago aún no está aprobado. Revisa el comprobante antes de enviar los accesos.</p>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="cred-first">Primer nombre</Label>
          <input id="cred-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="field" />
        </div>
        <div>
          <Label htmlFor="cred-last">Primer apellido</Label>
          <input id="cred-last" value={lastName} onChange={(e) => setLastName(e.target.value)} className="field" />
        </div>
        <div>
          <Label htmlFor="cred-id">Cédula</Label>
          <input id="cred-id" value={cedula} onChange={(e) => setCedula(e.target.value)} inputMode="numeric" placeholder="0604567891" className="field" />
        </div>
      </div>

      <dl className="grid gap-3 rounded-2xl bg-paper p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-ink/50">Usuario</dt>
          <dd className="break-all font-mono font-semibold text-navy">{username || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink/50">Contraseña</dt>
          <dd className="font-mono font-semibold text-navy">{password || "—"}</dd>
        </div>
      </dl>

      <a
        href={ready ? href : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ready || pending}
        onClick={(e) => {
          if (!ready || pending) return e.preventDefault();
          register();
        }}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors ${
          ready ? "bg-whatsapp hover:bg-[#1eb457]" : "pointer-events-none bg-line"
        }`}
      >
        <WhatsAppIcon className="size-4" />
        Enviar usuario y contraseña por WhatsApp
      </a>
      {sentAt && <p className="text-xs text-ink/50">Último envío registrado: {formatDate(sentAt, { dateStyle: "medium", timeStyle: "short" })}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
