import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { resolveSettings } from "@/lib/settings";
import { serviceClient } from "@/lib/supabase/service";

export const metadata: Metadata = { title: "Contenido" };

export default async function ContentPage() {
  await requireAdmin();
  const { data } = await serviceClient().from("site_settings").select("data").eq("id", 1).maybeSingle();
  return (
    <>
      <PageHeader title="Contenido del sitio" description="Contacto, cuentas bancarias, textos de Inicio y Nosotros, privacidad." />
      <SettingsForm settings={resolveSettings(data?.data)} />
    </>
  );
}
