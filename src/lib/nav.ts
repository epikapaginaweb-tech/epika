export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/cursos", label: "Cursos" },
  { href: "/docentes", label: "Docentes" },
  { href: "/contacto", label: "Contacto" },
];

export function isActive(pathname: string | null, href: string, root = "/") {
  if (!pathname) return false;
  return href === root ? pathname === root : pathname.startsWith(href);
}
