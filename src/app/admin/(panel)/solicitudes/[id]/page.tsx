import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteInquiry, setPaymentStatus, updateInquiry } from "@/actions/admin/inquiries";
import { CredentialsPanel } from "@/components/admin/CredentialsPanel";
import { PaymentBadge, STATUS_LABEL, StatusBadge } from "@/components/admin/badges";
import { Card, ConfirmForm, SubmitButton } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/site/icons";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/service";
import { INQUIRY_STATUSES, type Inquiry } from "@/lib/types";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Solicitud" };

export default async function InquiryPage({ params }: PageProps<"/admin/solicitudes/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const db = serviceClient();
  const [{ data }, settings] = await Promise.all([db.from("inquiries").select("*").eq("id", id).maybeSingle(), getSettings()]);
  const inquiry = data as Inquiry | null;
  if (!inquiry) notFound();

  const receipt = inquiry.receipt_path ? (await db.storage.from("receipts").createSignedUrl(inquiry.receipt_path, 60 * 15)).data?.signedUrl : null;
  const isPdf = inquiry.receipt_path?.endsWith(".pdf");
  const contactHref = whatsappUrl(
    inquiry.phone,
    `Hola ${inquiry.full_name.split(" ")[0]}, te escribimos de Épika Academy${inquiry.course_title ? ` sobre el programa «${inquiry.course_title}»` : ""}.`,
    settings.countryCode,
  );

  return (
    <>
      <Link href="/admin/solicitudes" className="text-sm font-semibold text-ink/50 hover:text-orange">
        ← Solicitudes
      </Link>
      <div className="mb-6 mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-navy">{inquiry.full_name}</h1>
        <StatusBadge status={inquiry.status} />
        <PaymentBadge status={inquiry.payment_status} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Card title="Datos de contacto">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Correo", inquiry.email],
                ["Teléfono", inquiry.phone],
                ["Programa", inquiry.course_title ?? "Consulta general"],
                ["Tipo", inquiry.kind === "reserva" ? "Solicitud de reserva" : "Consulta"],
                ["Recibida", formatDate(inquiry.created_at, { dateStyle: "long", timeStyle: "short" })],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-ink/50">{label}</dt>
                  <dd className="mt-0.5 break-words font-semibold text-navy">{value}</dd>
                </div>
              ))}
            </dl>
            {inquiry.message && <p className="mt-5 whitespace-pre-line rounded-2xl bg-paper p-4 text-sm text-ink/75">{inquiry.message}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={contactHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white">
                <WhatsAppIcon className="size-4" /> Escribir por WhatsApp
              </a>
              <a href={`mailto:${inquiry.email}`} className="rounded-full bg-paper px-4 py-2.5 text-sm font-semibold text-navy">
                Enviar correo
              </a>
            </div>
          </Card>

          <Card title="Seguimiento">
            <form key={inquiry.status} action={updateInquiry.bind(null, inquiry.id)} className="space-y-4">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estado">
                {INQUIRY_STATUSES.map((status) => (
                  <label key={status} className="cursor-pointer">
                    <input type="radio" name="status" value={status} defaultChecked={inquiry.status === status} className="peer sr-only" />
                    <span className="block rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink/60 peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-orange">
                      {STATUS_LABEL[status]}
                    </span>
                  </label>
                ))}
              </div>
              <textarea name="notes" defaultValue={inquiry.notes ?? ""} rows={3} placeholder="Notas internas" className="field resize-y" />
              <SubmitButton>Guardar seguimiento</SubmitButton>
            </form>
          </Card>

          <Card title="Accesos del estudiante" description="Usuario: primernombre.primerapellido@epika.education · Contraseña: Ek + cédula + *">
            <CredentialsPanel
              id={inquiry.id}
              fullName={inquiry.full_name}
              phone={inquiry.phone}
              courseTitle={inquiry.course_title}
              cedula={inquiry.cedula}
              countryCode={settings.countryCode}
              sentAt={inquiry.credentials_sent_at}
              paymentApproved={inquiry.payment_status === "aprobado"}
            />
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Comprobante de pago">
            {receipt ? (
              <div className="space-y-4">
                {isPdf ? (
                  <a href={receipt} target="_blank" rel="noopener noreferrer" className="flex h-40 items-center justify-center rounded-2xl bg-paper font-semibold text-navy">
                    Abrir PDF ↗
                  </a>
                ) : (
                  <a href={receipt} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={receipt} alt="Comprobante de pago" className="max-h-[28rem] w-full object-contain" />
                  </a>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {inquiry.payment_status === "aprobado" ? (
                    <p className="rounded-full bg-whatsapp/15 px-4 py-2.5 text-sm font-semibold text-[#128c4a]">Pago aprobado ✓</p>
                  ) : (
                    <form action={setPaymentStatus.bind(null, inquiry.id, "aprobado")}>
                      <SubmitButton className="!bg-whatsapp hover:!bg-[#1eb457]">Aprobar pago</SubmitButton>
                    </form>
                  )}
                  {inquiry.payment_status !== "rechazado" && (
                    <form action={setPaymentStatus.bind(null, inquiry.id, inquiry.payment_status === "aprobado" ? "en_revision" : "rechazado")}>
                      <SubmitButton className="!bg-white !text-red-600 ring-1 ring-red-200">
                        {inquiry.payment_status === "aprobado" ? "Deshacer aprobación" : "Rechazar"}
                      </SubmitButton>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="rounded-2xl bg-paper p-5 text-sm text-ink/55">Aún no hay comprobante. Si lo recibiste por WhatsApp, puedes aprobar el pago igualmente.</p>
                {inquiry.payment_status !== "aprobado" && (
                  <form action={setPaymentStatus.bind(null, inquiry.id, "aprobado")}>
                    <SubmitButton>Marcar pago como aprobado</SubmitButton>
                  </form>
                )}
              </div>
            )}
          </Card>

          <ConfirmForm action={deleteInquiry.bind(null, inquiry.id)} message="¿Eliminar esta solicitud y su comprobante? No se puede deshacer.">
            <button type="submit" className="text-sm font-semibold text-red-600 hover:underline">
              Eliminar solicitud
            </button>
          </ConfirmForm>
        </div>
      </div>
    </>
  );
}
