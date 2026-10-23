import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const helvena = localFont({ src: "./fonts/Helvena-Regular.otf", variable: "--font-helvena", weight: "400", display: "swap" });
const lovely = localFont({ src: "./fonts/MissingLovely-Regular.otf", variable: "--font-lovely", weight: "400", display: "swap" });
const anton = localFont({ src: "./fonts/Anton-Regular.woff2", variable: "--font-anton", weight: "400", display: "swap" });

// Aplica el modo azul y el idioma guardados antes del primer pintado (solo en el sitio público).
const PRE_PAINT = `try{if(location.pathname.indexOf("/admin")!==0){var d=document.documentElement;if(localStorage.getItem("epika-theme")==="night")d.dataset.theme="night";if(localStorage.getItem("epika-lang")==="en")d.lang="en"}}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Épika Academy", template: "%s · Épika Academy" },
  description:
    "Épika Academy: programas virtuales con instructores especializados. Conoce el catálogo y solicita tu reserva.",
  applicationName: "Épika Academy",
  openGraph: { type: "website", locale: "es_EC", siteName: "Épika Academy" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${helvena.variable} ${lovely.variable} ${anton.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
