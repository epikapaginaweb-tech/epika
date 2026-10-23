import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { PAYMENT_LABEL, PaymentBadge, STATUS_LABEL, StatusBadge } from "@/components/admin/badges";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/service";
import { INQUIRY_STATUSES, PAYMENT_STATUSES, type Inquiry, type InquiryStatus, type PaymentStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Solicitudes" };

export default async function InquiriesPage({ searchParams }: PageProps<"/admin/solicitudes">) {
  await requireAdmin();
  const params = await searchParams;
  const estado = INQUIRY_STATUSES.find((s) => s === params.estado);
  const pago = PAYMENT_STATUSES.find((s) => s === params.pago);
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 80) : "";

  let query = serviceClient().from("inquiries").select("*").order("created_at", { ascending: false }).limit(300);
  if (estado) query = query.eq("status", estado);
  if (pago) query = query.eq("payment_status", pago);
  if (q) {
    const term = q.replace(/[%,()"\\*:]/g, " ");
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,course_title.ilike.%${term}%`);
  }
  const { data } = await query;
  const inquiries = (data as Inquiry[] | null) ?? [];

  const tab = (label: string, href: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-navy text-white" : "bg-white text-ink/60 hover:text-navy"}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <PageHeader title="Solicitudes" description="Consultas y reservas recibidas desde el sitio." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tab("Todas", "/admin/solicitudes", !estado && !pago)}
        {INQUIRY_STATUSES.map((s) => tab(STATUS_LABEL[s as InquiryStatus], `/admin/solicitudes?estado=${s}`, estado === s))}
        <span className="mx-1 h-6 w-px bg-line" />
        {PAYMENT_STATUSES.filter((s) => s !== "sin_comprobante").map((s) =>
          tab(PAYMENT_LABEL[s as PaymentStatus], `/admin/solicitudes?pago=${s}`, pago === s),
        )}
        <form className="ml-auto w-full sm:w-64">
          <input type="search" name="q" defaultValue={q} placeholder="Buscar nombre, correo, programa…" className="field py-2.5" />
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wider text-ink/45">
              <tr>
                <th className="px-5 py-3 font-semibold">Fecha</th>
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="px-5 py-3 font-semibold">Programa</th>
                <th className="px-5 py-3 font-semibold">Tipo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="relative hover:bg-paper/60">
                  <td className="whitespace-nowrap px-5 py-4 text-ink/55">{formatDate(inq.created_at, { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/solicitudes/${inq.id}`} className="font-semibold text-navy after:absolute after:inset-0 hover:text-orange">
                      {inq.full_name}
                    </Link>
                    <p className="text-xs text-ink/50">{inq.email}</p>
                  </td>
                  <td className="px-5 py-4 text-ink/70">{inq.course_title ?? "—"}</td>
                  <td className="px-5 py-4 capitalize text-ink/70">{inq.kind}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={inq.status} />
                  </td>
                  <td className="px-5 py-4">
                    <PaymentBadge status={inq.payment_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inquiries.length === 0 && <p className="p-8 text-center text-sm text-ink/50">No hay solicitudes con este filtro.</p>}
      </div>
    </>
  );
}
