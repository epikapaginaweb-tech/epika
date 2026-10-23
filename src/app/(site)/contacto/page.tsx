import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Faq } from "@/components/site/Faq";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SocialIcon, WhatsAppIcon } from "@/components/site/icons";
import { TAGS, getCourses, getFaqs, getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos por WhatsApp, correo o el formulario de consultas. El equipo de Épika Academy te responde.",
  alternates: { canonical: "/contacto" },
};

const SAFE_MAP = /^https:\/\/(www\.)?google\.com\/maps\/embed\?/;

export default async function ContactPage() {
  "use cache";
  cacheTag(TAGS.courses, TAGS.faqs, TAGS.settings);
  cacheLife("hours");

  const [courses, faqs, settings] = await Promise.all([getCourses(), getFaqs(), getSettings()]);
  const whatsapp = whatsappUrl(settings.whatsapp, "Hola, tengo una consulta sobre Épika Academy.", settings.countryCode);
  const socials = Object.entries(settings.socials).filter(([, url]) => url);
  const channels = [
    settings.whatsapp && { label: "WhatsApp", value: settings.whatsapp, href: whatsapp },
    settings.email && { label: "Correo", value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: "Teléfono", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.address && { label: "Dirección", value: settings.address },
    settings.hours && { label: "Horario de atención", value: settings.hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <>
      <section className="container-page pb-10 pt-12 md:pt-20">
        <SectionHeading
          as="h1"
          eyebrow="Contacto Épika"
          title="En qué te podemos"
          accent="ayudar."
          description="Déjanos tu consulta y te respondemos a la brevedad. Si prefieres, escríbenos directo por WhatsApp."
        />
      </section>

      <section className="container-page grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <Reveal>
          <div className="relative rounded-[2rem] bg-white p-6 md:p-10">
            <InquiryForm
              kind="consulta"
              courses={courses.map((c) => ({ id: c.id, title: c.title }))}
              bankAccounts={settings.bankAccounts}
              paymentNote={settings.paymentNote}
              whatsappHref={whatsappUrl(settings.whatsapp, "Hola, envío mi comprobante de pago para Épika Academy.", settings.countryCode)}
            />
          </div>
        </Reveal>

        <RevealGroup className="space-y-4">
          <RevealItem>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-[1.5rem] bg-whatsapp p-6 text-white transition-transform hover:-translate-y-1"
            >
              <span>
                <span className="block text-sm text-white/80">Respuesta rápida</span>
                <span className="text-xl font-bold">Escríbenos por WhatsApp</span>
              </span>
              <WhatsAppIcon className="size-9 transition-transform group-hover:rotate-12" />
            </a>
          </RevealItem>
          {channels.length > 0 && (
            <RevealItem>
              <dl className="divide-y divide-line rounded-[1.5rem] bg-white px-6">
                {channels.map((item) => (
                  <div key={item.label} className="py-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-ink/45">{item.label}</dt>
                    <dd className="mt-1 font-semibold text-navy">
                      {item.href ? (
                        <a href={item.href} className="hover:text-orange" {...(item.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
                          {item.value}
                        </a>
                      ) : (
                        <span className="whitespace-pre-line">{item.value}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
          )}
          {socials.length > 0 && (
            <RevealItem>
              <div className="flex flex-wrap gap-2 rounded-[1.5rem] bg-white p-5">
                {socials.map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-semibold capitalize text-navy transition-colors hover:bg-orange hover:text-white"
                  >
                    <SocialIcon name={name} /> {name}
                  </a>
                ))}
              </div>
            </RevealItem>
          )}
        </RevealGroup>
      </section>

      {SAFE_MAP.test(settings.mapEmbed) && (
        <section className="container-page pt-8">
          <Reveal>
            <iframe
              src={settings.mapEmbed}
              title="Ubicación de Épika Academy"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full rounded-[2rem] border-0 grayscale-[30%] md:h-[26rem]"
            />
          </Reveal>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="container-page grid gap-10 py-24 md:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Resolvemos tus" accent="dudas." />
          <Reveal>
            <Faq items={faqs} />
          </Reveal>
        </section>
      )}
    </>
  );
}
