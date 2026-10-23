"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { isActive } from "@/lib/nav";

const LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/solicitudes", label: "Solicitudes" },
  { href: "/admin/programas", label: "Programas" },
  { href: "/admin/instructores", label: "Instructores" },
  { href: "/admin/contenido", label: "Contenido" },
  { href: "/admin/faq", label: "Preguntas" },
  { href: "/admin/testimonios", label: "Testimonios" },
];

function NavLinks({ pathname }: { pathname: string | null }) {
  return LINKS.map((link) => {
    const active = isActive(pathname, link.href, "/admin");
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors lg:rounded-2xl ${
          active ? "bg-navy text-white" : "text-ink/60 hover:bg-white hover:text-navy"
        }`}
      >
        {link.label}
      </Link>
    );
  });
}

function ActiveLinks() {
  return <NavLinks pathname={usePathname()} />;
}

export function AdminNav() {
  return (
    <nav aria-label="Panel" className="flex gap-1 overflow-x-auto lg:flex-col">
      <Suspense fallback={<NavLinks pathname={null} />}>
        <ActiveLinks />
      </Suspense>
    </nav>
  );
}
