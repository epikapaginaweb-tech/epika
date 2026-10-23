import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { CourseImage } from "@/components/site/CourseImage";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TAGS, getCourses, getSettings } from "@/lib/data";
import { MODALITY_LABEL, formatDate, formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Solicitar reserva",
  description: "Solicita tu cupo en un programa de Épika Academy. Te contactaremos para confirmar disponibilidad.",
  alternates: { canonical: "/reservar" },
};

async function ReserveForm({ slug }: { slug: string | undefined }) {
  "use cache";
  cacheTag(TAGS.courses, TAGS.settings);
  cacheLife("hours");

  const [courses, settings] = await Promise.all([getCourses(), getSettings()]);
  const selected = courses.find((c) => c.slug === slug);
  const price = selected && formatPrice(selected.price, selected.currency);
  const start = selected && formatDate(selected.start_date);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <Reveal>
        <div className="rounded-[2rem] bg-white p-6 md:p-10">
          <InquiryForm
            key={selected?.id ?? "none"}
            kind="reserva"
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
            defaultCourseId={selected?.id}
            bankAccounts={settings.bankAccounts}
            paymentNote={settings.paymentNote}
            whatsappHref={whatsappUrl(
              settings.whatsapp,
              `Hola, envío mi comprobante de pago${selected ? ` del programa «${selected.title}»` : ""}.`,
              settings.countryCode,
            )}
          />
        </div>
      </Reveal>
      {selected ? (
        <Reveal delay={0.1}>
          <aside className="overflow-hidden rounded-[2rem] bg-navy text-white">
            <div className="relative aspect-[16/10]">
              <CourseImage src={selected.image_url} title={selected.title} sizes="(min-width: 1024px) 30vw, 100vw" label={selected.title} />
            </div>
            <div className="p-7">
              <span className="bubble bg-orange text-white">{MODALITY_LABEL[selected.modality]}</span>
              <p className="mt-4 text-2xl font-bold tracking-tight">{selected.title}</p>
              <dl className="mt-5 space-y-3 text-sm">
                {start && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/55">Inicio</dt>
                    <dd className="font-semibold">{start}</dd>
                  </div>
                )}
                {selected.schedule && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/55">Horario</dt>
                    <dd className="text-right font-semibold">{selected.schedule}</dd>
                  </div>
                )}
                {price && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/55">Inversión</dt>
                    <dd className="font-semibold text-orange">{price}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <aside className="rounded-[2rem] bg-navy p-8 text-white">
            <p className="text-2xl font-bold tracking-tight">¿Cómo funciona?</p>
            <ol className="mt-6 space-y-4 text-sm text-white/75">
              {["Envía tu solicitud.", "Realiza el pago y sube el comprobante.", "Confirmamos tu cupo y te enviamos tus accesos."].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </aside>
        </Reveal>
      )}
    </div>
  );
}

async function ReserveFromParams({ searchParams }: { searchParams: PageProps<"/reservar">["searchParams"] }) {
  const { curso } = await searchParams;
  return <ReserveForm slug={typeof curso === "string" ? curso : undefined} />;
}

export default function ReservePage({ searchParams }: PageProps<"/reservar">) {
  return (
    <section className="container-page pb-10 pt-12 md:pt-20">
      <SectionHeading
        as="h1"
        eyebrow="Reserva Épika"
        title="Solicita tu"
        accent="reserva."
        description="Completa tus datos. Esta solicitud no confirma el cupo: nuestro equipo te contactará para confirmar disponibilidad."
      />
      <div className="mt-12">
        <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-[2rem] bg-white" />}>
          <ReserveFromParams searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
