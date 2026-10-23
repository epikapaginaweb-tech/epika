"use client";

import { saveSettings } from "@/actions/admin/content";
import type { SiteSettings } from "@/lib/types";
import { GalleryInput } from "./GalleryInput";
import { Repeater } from "./Repeater";
import { Card, FormMessage, SubmitButton, TextArea, TextInput, useFormAction } from "./ui";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { state, onSubmit, pending } = useFormAction(saveSettings);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Card title="Contacto" description="Se usa en el botón flotante, el encabezado, el pie de página y la página Contacto.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="WhatsApp general" name="whatsapp" defaultValue={settings.whatsapp} placeholder="098 038 1003" hint="Botón flotante, pie de página y Contacto" />
          <TextInput label="WhatsApp de ventas (asesor)" name="salesWhatsapp" defaultValue={settings.salesWhatsapp} placeholder="098 328 9076" hint="Botón «Habla con tu asesor»" />
          <TextInput label="Campus virtual (enlace)" name="campusUrl" defaultValue={settings.campusUrl} placeholder="https://" hint="Botón «Campus virtual» del menú" />
          <TextInput label="Etiqueta de la tarjeta central" name="promoLabel" defaultValue={settings.promoLabel} hint="Ej. Promoción, Programa estrella. Se aplica al programa marcado como destacado" />
          <TextInput label="Código de país" name="countryCode" defaultValue={settings.countryCode} hint="593 = Ecuador, 506 = Costa Rica" />
          <TextInput label="Correo" name="email" type="email" defaultValue={settings.email} />
          <TextInput label="Teléfono" name="phone" defaultValue={settings.phone} />
          <TextArea label="Dirección" name="address" defaultValue={settings.address} rows={2} />
          <TextArea label="Horario de atención" name="hours" defaultValue={settings.hours} rows={2} />
          <TextArea
            label="Mapa de Google"
            name="mapEmbed"
            defaultValue={settings.mapEmbed}
            rows={2}
            hint="Google Maps → Compartir → Insertar mapa → pega el código"
            className="md:col-span-2"
          />
        </div>
      </Card>

      <Card title="Redes sociales" description="Pega el enlace completo. Las vacías no se muestran.">
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(settings.socials) as (keyof SiteSettings["socials"])[]).map((key) => (
            <TextInput key={key} label={key[0].toUpperCase() + key.slice(1)} name={`socials.${key}`} defaultValue={settings.socials[key]} placeholder="https://" />
          ))}
        </div>
      </Card>

      <Card title="Pagos" description="Se muestran al completar el formulario de reserva o consulta con programa.">
        <div className="space-y-4">
          <Repeater
            name="bankAccounts"
            label="Cuentas bancarias"
            addLabel="Agregar cuenta"
            defaultValue={settings.bankAccounts}
            fields={[
              { key: "bank", label: "Banco" },
              { key: "holder", label: "Titular" },
              { key: "idNumber", label: "Cédula / cédula jurídica" },
              { key: "account", label: "Número de cuenta" },
              { key: "iban", label: "IBAN" },
              { key: "sinpe", label: "SINPE Móvil" },
            ]}
          />
          <TextArea label="Instrucciones de pago" name="paymentNote" defaultValue={settings.paymentNote} rows={3} />
        </div>
      </Card>

      <Card title="Inicio">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Etiqueta superior" name="hero.eyebrow" defaultValue={settings.hero.eyebrow} />
          <TextInput label="Título" name="hero.title" defaultValue={settings.hero.title} />
          <TextInput label="Título resaltado (naranja)" name="hero.highlight" defaultValue={settings.hero.highlight} />
          <TextArea label="Subtítulo" name="hero.subtitle" defaultValue={settings.hero.subtitle} rows={2} />
          <div className="md:col-span-2">
            <Repeater
              name="benefits"
              label="Beneficios de estudiar en Épika"
              addLabel="Agregar beneficio"
              defaultValue={settings.benefits}
              fields={[
                { key: "title", label: "Título" },
                { key: "text", label: "Texto", multiline: true },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card title="Contador" description="Cifras animadas que aparecen en Inicio y Nosotros. Si no agregas ninguna, la sección no se muestra.">
        <Repeater
          name="stats"
          label="Cifras"
          addLabel="Agregar cifra"
          defaultValue={settings.stats}
          fields={[
            { key: "value", label: "Número (solo dígitos)" },
            { key: "label", label: "Texto (ej. Estudiantes formados)" },
            { key: "prefix", label: "Antes del número (ej. +)" },
            { key: "suffix", label: "Después del número (ej. %, h, k)" },
          ]}
        />
      </Card>

      <Card title="Nosotros">
        <div className="grid gap-4">
          <TextArea label="Introducción" name="about.intro" defaultValue={settings.about.intro} rows={2} />
          <TextArea label="Historia" name="about.history" defaultValue={settings.about.history} rows={6} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea label="Misión" name="about.mission" defaultValue={settings.about.mission} rows={4} />
            <TextArea label="Visión" name="about.vision" defaultValue={settings.about.vision} rows={4} />
          </div>
          <Repeater
            name="about.methodology"
            label="Metodología"
            addLabel="Agregar paso"
            defaultValue={settings.about.methodology}
            fields={[
              { key: "title", label: "Paso" },
              { key: "text", label: "Descripción", multiline: true },
            ]}
          />
          <GalleryInput name="about.gallery" label="Fotografías de la academia" defaultValue={settings.about.gallery} />
        </div>
      </Card>

      <Card title="Legal y buscadores">
        <div className="grid gap-4">
          <TextArea label="Aviso de privacidad" name="privacy" defaultValue={settings.privacy} rows={8} />
          <TextArea label="Descripción para Google y redes" name="seoDescription" defaultValue={settings.seoDescription} rows={2} hint="Máximo ~160 caracteres" />
        </div>
      </Card>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-3xl bg-white/90 p-4 shadow-lg backdrop-blur">
        <SubmitButton pending={pending}>Guardar contenido</SubmitButton>
        <div className="flex-1">
          <FormMessage state={state} />
        </div>
      </div>
    </form>
  );
}
