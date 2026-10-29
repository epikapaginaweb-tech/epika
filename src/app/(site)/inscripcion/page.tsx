import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";
import { EnrollmentForm } from "@/components/forms/EnrollmentForm";
import { RevealText } from "@/components/motion/RevealText";
import { TAGS, getCourses, getSettings } from "@/lib/data";
import { formatDate, formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Formulario de inscripción",
  description: "Inscríbete en un programa de Épika Academy: completa tus datos y sube tu comprobante de pago.",
  alternates: { canonical: "/inscripcion" },
  robots: { index: false },
};

async function Enrollment({ slug }: { slug: string | undefined }) {
  "use cache";
  cacheTag(TAGS.courses, TAGS.settings);
  cacheLife("hours");

  const [courses, settings] = await Promise.all([getCourses(), getSettings()]);
  const course = courses.find((c) => c.slug === slug);

  if (!course || course.coming_soon) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center">
        <p className="text-xl font-bold text-navy">{course ? "Este programa estará disponible próximamente." : "Elige un programa para inscribirte."}</p>
        <p className="mt-2 text-sm text-ink/60">{course ? "Aún no tiene inscripciones abiertas." : "Desde cada programa encontrarás el botón «Inscríbete»."}</p>
        <Link href={course ? `/programas/${course.slug}` : "/programas"} className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-sm font-bold text-white">
          {course ? "Ver el programa" : "Ver programas"}
        </Link>
      </div>
    );
  }

  const price = formatPrice(course.price, course.currency);
  const start = formatDate(course.start_date);
  const end = formatDate(course.end_date);
  return (
    <>
      <p className="mb-6 text-sm text-ink/60">
        Programa: <span className="font-bold text-navy">{course.title}</span>
        {price && (
          <>
            {" "}
            · Plan contado <span className="font-bold text-orange">{price}</span>
          </>
        )}
        {start && (
          <>
            {" "}
            · Inicio <span className="font-semibold text-navy">{start}</span>
          </>
        )}
        {end && (
          <>
            {" "}
            · Culminación <span className="font-semibold text-navy">{end}</span>
          </>
        )}
      </p>
      <EnrollmentForm
        courseId={course.id}
        courseTitle={course.title}
        bankAccounts={settings.bankAccounts}
        paymentNote={settings.paymentNote}
        whatsappHref={whatsappUrl(settings.salesWhatsapp || settings.whatsapp, `Hola, me inscribí en «${course.title}» y envío mi comprobante de pago.`, settings.countryCode)}
      />
    </>
  );
}

async function EnrollmentFromParams({ searchParams }: { searchParams: PageProps<"/inscripcion">["searchParams"] }) {
  const { curso } = await searchParams;
  return <Enrollment slug={typeof curso === "string" ? curso : undefined} />;
}

export default function EnrollmentPage({ searchParams }: PageProps<"/inscripcion">) {
  return (
    <section className="container-page pb-10 pt-10 md:pt-14">
      <RevealText as="h1" text="Formulario de" accent="inscripción" accentFont="script" className="bolder text-4xl font-bold leading-none md:text-5xl" />
      <div className="mt-10">
        <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-[2rem] bg-white" />}>
          <EnrollmentFromParams searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
