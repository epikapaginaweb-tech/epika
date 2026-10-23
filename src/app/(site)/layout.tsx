import { cacheLife, cacheTag } from "next/cache";
import { BackToTop } from "@/components/motion/BackToTop";
import { Cursor } from "@/components/motion/Cursor";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { TAGS, getSettings } from "@/lib/data";
import { whatsappUrl } from "@/lib/whatsapp";

const GREETING = "Hola, quiero información sobre los cursos de Épika Academy.";

async function Chrome({ children }: { children: React.ReactNode }) {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("hours");
  const settings = await getSettings();
  const whatsapp = whatsappUrl(settings.whatsapp, GREETING, settings.countryCode);

  return (
    <>
      <Header whatsappHref={whatsapp} />
      <main id="contenido">{children}</main>
      <Footer settings={settings} year={new Date().getFullYear()} />
      <WhatsAppFloat href={whatsapp} />
    </>
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <BackToTop />
      <Chrome>{children}</Chrome>
    </MotionProvider>
  );
}
