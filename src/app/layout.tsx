import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const helvena = localFont({ src: "./fonts/Helvena-Regular.otf", variable: "--font-helvena", weight: "400", display: "swap" });
const lovely = localFont({ src: "./fonts/MissingLovely-Regular.otf", variable: "--font-lovely", weight: "400", display: "swap" });
const anton = localFont({ src: "./fonts/Anton-Regular.woff2", variable: "--font-anton", weight: "400", display: "swap" });

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
    <html lang="es" className={`${helvena.variable} ${lovely.variable} ${anton.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
