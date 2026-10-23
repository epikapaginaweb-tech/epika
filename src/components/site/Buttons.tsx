import Link from "next/link";
import { Magnetic } from "../motion/Magnetic";
import { ArrowIcon, WhatsAppIcon } from "./icons";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 active:scale-[0.98]";

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Magnetic>
      <Link href={href} className={`${base} btn-fill bg-navy text-white`}>
        {children}
        <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Magnetic>
  );
}

export function WhatsAppLink({ href, children, tone = "light" }: { href: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <Magnetic>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${tone === "light" ? "bg-white text-navy shadow-sm hover:text-whatsapp" : "bg-white/10 text-white hover:bg-whatsapp"}`}
      >
        <WhatsAppIcon className="size-4.5" />
        {children}
      </a>
    </Magnetic>
  );
}
