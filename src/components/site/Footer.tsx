import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { NAV } from "@/lib/nav";
import { whatsappUrl } from "@/lib/whatsapp";
import { SocialIcon, WhatsAppIcon } from "./icons";

export function Footer({ settings, year }: { settings: SiteSettings; year: number }) {
  const whatsapp = whatsappUrl(settings.whatsapp, "Hola, quiero información sobre Épika Academy.", settings.countryCode);
  const { facebook, instagram, tiktok, linkedin, youtube } = settings.socials;
  const socials = [
    { name: "facebook", url: facebook },
    { name: "instagram", url: instagram },
    { name: "whatsapp", url: whatsapp },
    { name: "tiktok", url: tiktok },
    { name: "linkedin", url: linkedin },
    { name: "youtube", url: youtube },
  ].filter((s) => s.url);

  const contact = [
    settings.email && { label: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.address && { label: settings.address },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <footer className="site-footer bg-navy text-white">
      <div className="container-page pb-8 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image src="/brand/logo-light.png" alt="Épika Academy" width={1186} height={438} className="h-16 w-auto" />
            {socials.length > 0 && (
              <ul className="mt-8 flex gap-2">
                {socials.map(({ name, url }) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex size-9 items-center justify-center rounded-full bg-white text-navy transition-colors hover:bg-orange hover:text-white"
                    >
                      {name === "whatsapp" ? <WhatsAppIcon className="size-4.5" /> : <SocialIcon name={name} className="size-4.5" />}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Pie de página">
            <p className="text-lg font-bold tracking-tight">Explora</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-orange">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/reservar" className="transition-colors hover:text-orange">
                  Solicitar Reserva
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-lg font-bold tracking-tight">Contacto</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-orange">
                  Escríbenos por WhatsApp
                </a>
              </li>
              {contact.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-orange">
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
              {settings.hours && <li>{settings.hours}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {year} Épika Academy. Todos los derechos reservados.</p>
          <Link href="/privacidad" className="hover:text-orange">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
