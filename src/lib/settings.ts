import type { SiteSettings } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "098 038 1003",
  salesWhatsapp: "098 328 9076",
  campusUrl: "https://campusvirtual.epika.education/",
  promoLabel: "Promoción",
  countryCode: "593",
  email: "",
  phone: "",
  address: "",
  hours: "",
  mapEmbed: "",
  socials: { instagram: "", facebook: "", tiktok: "", linkedin: "", youtube: "" },
  bankAccounts: [],
  paymentNote:
    "Realiza la transferencia o SINPE indicando tu nombre completo y el programa. Luego sube el comprobante aquí mismo.",
  hero: {
    eyebrow: "Épika Academy",
    title: "Desarrolla tu potencial",
    highlight: "Lidera tu futuro.",
    subtitle: "",
  },
  benefits: [
    { title: "Aprendizaje práctico", text: "Cada módulo está pensado para aplicarse desde el primer día." },
    { title: "Acompañamiento cercano", text: "Resolvemos tus dudas durante todo el proceso, no solo en clase." },
    { title: "100% virtual", text: "Estudia desde cualquier lugar, solo necesitas conexión a internet." },
    { title: "Comunidad Épika", text: "Conecta con personas que comparten tus metas y tu ritmo." },
  ],
  stats: [],
  about: {
    intro: "",
    history: "",
    mission: "",
    vision: "",
    methodology: [],
    gallery: [],
  },
  privacy:
    "En Épika Academy usamos los datos que nos compartes (nombre, correo, teléfono y mensaje) únicamente para responder tu consulta, gestionar tu reserva y enviarte información sobre el programa de tu interés.\n\nNo vendemos ni compartimos tu información con terceros. Los comprobantes de pago se almacenan de forma privada y solo el equipo administrativo puede consultarlos.\n\nPuedes solicitar en cualquier momento la actualización o eliminación de tus datos escribiéndonos por los canales de contacto publicados en este sitio.",
  seoDescription:
    "Épika Academy: programas virtuales con instructores especializados. Conoce el catálogo y solicita tu reserva.",
};

type Plain = Record<string, unknown>;

function isPlain(value: unknown): value is Plain {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function merge<T>(base: T, patch: unknown): T {
  if (!isPlain(base) || !isPlain(patch)) {
    if (patch === undefined || patch === null) return base;
    if (Array.isArray(base)) return (Array.isArray(patch) ? patch : base) as T;
    return (typeof patch === typeof base ? patch : base) as T;
  }
  const out: Plain = { ...base };
  for (const key of Object.keys(base)) out[key] = merge(base[key], patch[key]);
  return out as T;
}

export function resolveSettings(data: unknown): SiteSettings {
  return merge(DEFAULT_SETTINGS, data);
}
