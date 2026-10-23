import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { PaymentBadge, StatusBadge } from "@/components/admin/badges";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { serviceClient } from "@/lib/supabase/service";
import type { Inquiry } from "@/lib/types";

async function count(table: string, filter?: [string, string | boolean]) {
  let query = serviceClient().from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter[0], filter[1]);
  const { count } = await query;
  return count ?? 0;
}

export default async function DashboardPage() {
  await requireAdmin();
  const db = serviceClient();
  const [fresh, toReview, courses, teachers, recent] = await Promise.all([
    count("inquiries", ["status", "nueva"]),
    count("inquiries", ["payment_status", "en_revision"]),
    count("courses", ["visible", true]),
    count("teachers"),
    db.from("inquiries").select("*").order("created_at", { ascending: false }).limit(6),
  ]);

  const stats = [
    { label: "Solicitudes nuevas", value: fresh, href: "/admin/solicitudes?estado=nueva", accent: true },
    { label: "Pagos por revisar", value: toReview, href: "/admin/solicitudes?pago=en_revision" },
    { label: "Cursos publicados", value: courses, href: "/admin/cursos" },
    { label: "Docentes", value: teachers, href: "/admin/docentes" },
  ];

  return (
    <>
      <PageHeader title="Resumen" description="Lo más importante de la academia en un vistazo." action={{ href: "/admin/cursos/nuevo", label: "+ Nuevo curso" }} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-3xl p-6 transition-transform hover:-translate-y-1 ${stat.accent ? "bg-orange text-white" : "bg-white text-navy"}`}
          >
            <p className={`text-sm font-medium ${stat.accent ? "text-white/80" : "text-ink/55"}`}>{stat.label}</p>
            <p className="mt-4 text-5xl font-extrabold tracking-tight">{stat.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-6 rounded-3xl bg-white p-5 md:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Últimas solicitudes</h2>
          <Link href="/admin/solicitudes" className="text-sm font-semibold text-orange">
            Ver todas →
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {((recent.data as Inquiry[] | null) ?? []).map((inq) => (
            <li key={inq.id}>
              <Link href={`/admin/solicitudes/${inq.id}`} className="flex flex-wrap items-center gap-3 py-3.5 hover:text-orange">
                <span className="min-w-40 flex-1 font-semibold text-navy">{inq.full_name}</span>
                <span className="text-sm text-ink/55">{inq.course_title ?? "Consulta general"}</span>
                <StatusBadge status={inq.status} />
                <PaymentBadge status={inq.payment_status} />
                <span className="text-xs text-ink/45">{formatDate(inq.created_at, { dateStyle: "medium" })}</span>
              </Link>
            </li>
          ))}
          {!recent.data?.length && <li className="py-6 text-sm text-ink/50">Aún no hay solicitudes.</li>}
        </ul>
      </section>
    </>
  );
}
