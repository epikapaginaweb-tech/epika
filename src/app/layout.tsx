import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Épika Academy", template: "%s · Épika Academy" },
  description:
    "Épika Academy: programas virtuales con instructores especializados. Conoce el catálogo y solicita tu reserva.",
  applicationName: "Épika Academy",
  openGraph: { type: "website", locale: "es_CR", siteName: "Épika Academy" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
