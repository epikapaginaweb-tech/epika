"use client";

import Image from "next/image";
import { LangSwitch } from "./LangSwitch";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { NAV, isActive } from "@/lib/nav";
import { EASE_OUT } from "../motion/ease";
import { ArrowIcon } from "./icons";

type NavProps = { pathname: string | null; onNavigate: () => void };

function DesktopLinks({ pathname }: NavProps) {
  return NAV.map((item) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          active ? "text-navy" : "text-ink/60 hover:text-navy"
        }`}
      >
        {active && <motion.span layoutId="nav-dot" className="size-1.5 rounded-full bg-orange" />}
        {item.label}
      </Link>
    );
  });
}

function MobileLinks({ pathname, onNavigate }: NavProps) {
  return NAV.map((item, i) => (
    <motion.li
      key={item.href}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE_OUT }}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`block py-2 text-4xl font-bold tracking-tight ${isActive(pathname, item.href) ? "text-orange" : "text-navy"}`}
      >
        {item.label}
      </Link>
    </motion.li>
  ));
}

function WithPathname({ render, onNavigate }: { render: (props: NavProps) => React.ReactNode; onNavigate: () => void }) {
  const pathname = usePathname();
  return render({ pathname, onNavigate });
}

function Links({ render, onNavigate }: { render: (props: NavProps) => React.ReactNode; onNavigate: () => void }) {
  return (
    <Suspense fallback={render({ pathname: null, onNavigate })}>
      <WithPathname render={render} onNavigate={onNavigate} />
    </Suspense>
  );
}

export function Header({ campusHref }: { campusHref: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
    setHidden(y > 240 && y > (scrollY.getPrevious() ?? 0));
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || open ? "bg-paper/85 shadow-[0_1px_0_rgba(12,22,38,0.06)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="container-page flex h-18 items-center justify-between gap-6">
          <Link href="/" className="relative z-50 shrink-0" onClick={close} aria-label="Épika Academy, inicio">
            <Image src="/brand/logo.png" alt="Épika Academy" width={1060} height={392} className="logo-day h-10 w-auto md:h-11" loading="eager" />
            <Image src="/brand/logo-light.png" alt="Épika Academy" width={1186} height={438} className="logo-night h-10 w-auto md:h-11" loading="eager" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            <Links render={DesktopLinks} onNavigate={close} />
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LangSwitch />
            <a
              href={campusHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-white"
            >
              Campus Virtual
              <ArrowIcon className="size-3.5" />
            </a>
          </div>

          <button
            type="button"
            className="relative z-50 flex size-11 items-center justify-center rounded-full bg-white shadow-sm md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-navy transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-navy transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`}
              />
            </span>
          </button>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Principal"
            className="fixed inset-0 z-40 flex flex-col bg-paper px-6 pb-10 pt-28 md:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <ul className="space-y-1">
              <Links render={MobileLinks} onNavigate={close} />
            </ul>
            <LangSwitch className="mt-auto self-start" />
            <a
              href={campusHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-4 text-center font-bold text-white"
            >
              Campus Virtual
              <ArrowIcon className="size-4" />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
