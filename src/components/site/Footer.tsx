import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { NAV } from "@/lib/nav";
import { Wordmark } from "../motion/Wordmark";
import { SocialIcon } from "./icons";

export function Footer({ settings, year }: { settings: SiteSettings; year: number }) {
  const socials = Object.entries(settings.socials).filter(([, url]) => url);
  const contact = [
    settings.email && { label: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    settings.address && { label: settings.address },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <footer className="container-page pb-6 pt-24">
      <div className="rounded-[2rem] bg-white px-6 py-12 shadow-[0_1px_0_rgba(0,0,0,0.04)] md:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src="/brand/logo.png" alt="Épika Academy" width={1459} height={470} className="h-11 w-auto" />
            <p className="mt-5 max-w-sm text-2xl font-bold leading-tight tracking-tight text-navy">
              Tu próximo nivel <span className="text-orange">empieza aquí.</span>
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="flex size-10 items-center justify-center rounded-full bg-paper text-navy transition-colors hover:bg-orange hover:text-white"
                    >
                      <SocialIcon name={name} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Pie de página">
            <p className="eyebrow">Explora</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink/70 transition-colors hover:text-orange">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/reservar" className="text-ink/70 transition-colors hover:text-orange">
                  Solicitar reserva
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Contacto</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/70">
              {contact.length === 0 && <li>Escríbenos por WhatsApp.</li>}
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

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} Épika Academy. Todos los derechos reservados.</p>
          <Link href="/privacidad" className="hover:text-orange">
            Aviso de privacidad
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <Wordmark text="épika" />
      </div>
    </footer>
  );
}
