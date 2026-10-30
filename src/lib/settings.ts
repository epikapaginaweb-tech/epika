import type { SiteSettings } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "098 038 1003",
  salesWhatsapp: "098 328 9076",
  campusUrl: "https://campusvirtual.epika.education/",
  promoLabel: "Promoción",
  promoText: "",
  countryCode: "593",
  email: "epikaacademiadecapacitacion@gmail.com",
  phone: "",
  address: "",
  hours: "",
  mapEmbed: "",
  socials: {
    instagram: "https://www.instagram.com/epika_academy/",
    facebook: "https://www.facebook.com/EPIKAAcademiadeCapacitacion?locale=es_LA",
    tiktok: "https://www.tiktok.com/@epika_academy",
    linkedin: "",
    youtube: "",
  },
  bankAccounts: [
    { bank: "Produbanco", holder: "EPIKACADEMY S.A.S", idNumber: "0691786832001", accountType: "", account: "12006889986" },
  ],
  paymentNote:
    "Realiza la transferencia bancaria indicando tu nombre completo y el programa. Luego sube el comprobante aquí mismo.",
  hero: {
    eyebrow: "Épika Academy",
    title: "Desarrolla tu potencial",
    highlight: "Lidera tu futuro",
    subtitle: "",
  },
  benefits: [
    { title: "Aprendizaje práctico", text: "Cada módulo está pensado para aplicarse desde el primer día." },
    { title: "Acompañamiento cercano", text: "Resolvemos tus dudas durante todo el proceso, no solo en clase." },
    { title: "100% virtual", text: "Estudia desde cualquier lugar, solo necesitas conexión a internet." },
    { title: "Comunidad Épika", text: "Conecta con personas que comparten tus metas y tu ritmo." },
  ],
  stats: [{ value: "500", prefix: "+", suffix: "", label: "Profesionales certificados" }],
  about: {
    intro: "Épika es una academia de capacitación que impulsa el crecimiento personal y profesional. Brindamos formación de calidad para que cada persona descubra su potencial, se supere y lidere su futuro con confianza y propósito.",
    history: "",
    mission: "Impulsar el crecimiento personal y profesional de cada estudiante a través de programas 100% virtuales, prácticos y actualizados, guiados por profesionales en ejercicio, para que aprenda haciendo, aplique lo aprendido desde el primer día y lidere su futuro con confianza y propósito.",
    vision: "Ser la academia virtual de referencia en Ecuador y Latinoamérica en formación práctica en marketing digital, inteligencia artificial y gestión empresarial, reconocida por una comunidad de egresados que genera resultados reales en sus trabajos, emprendimientos y empresas.",
    methodology: [],
    pillars: [
      {
        title: "Excelencia con enfoque práctico",
        objective: "Ofrecer programas actualizados y pertinentes, donde cada estudiante aprenda haciendo y salga preparado para las exigencias reales del mercado laboral.",
        axes: "Metodologías basadas en casos reales, proyectos y práctica guiada.\nActualización permanente de contenidos según la demanda profesional.\nEvaluación del aprendizaje y seguimiento de la satisfacción estudiantil.",
      },
      {
        title: "Docentes del mundo profesional",
        objective: "Consolidar un cuerpo docente integrado por profesionales en ejercicio, dentro y fuera del país, que traigan a las aulas la experiencia y las tendencias de su campo.",
        axes: "Selección y formación continua de docentes en ejercicio.\nRed de profesionales que trabajan en otros países.\nCultura de colaboración e intercambio de buenas prácticas entre docentes.",
      },
    ],
    gallery: [],
  },
  offer: {
    enabled: true,
    programa: true,
    seminario: true,
    otro: true,
    showComingSoon: true,
    comingSoonSlogan: "Lo que se viene impulsará tu carrera al siguiente nivel. ¡Mantente atento!",
  },
  motto: "Tu futuro no se espera, se construye. Empieza hoy.",
  thanks: {
    title: "¡Gracias por tu compra!",
    text: "Recibimos tu comprobante. En un máximo de 24 horas validaremos el pago y te enviaremos tus credenciales del campus virtual y el enlace al grupo oficial de WhatsApp, donde compartiremos accesos a clases en vivo y comunicados.\n\n*Nota:* Si no recibes la información, contacta a nuestro equipo de soporte.",
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
