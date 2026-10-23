export function normalizePhone(phone: string, countryCode = "506") {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.length <= 8 ? `${countryCode}${digits}` : digits;
}

export function whatsappUrl(phone: string, message = "", countryCode?: string) {
  const number = normalizePhone(phone, countryCode);
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text}`;
}

export function courseMessage(courseTitle: string) {
  return `Hola, me interesa el curso «${courseTitle}» de Épika Academy. ¿Me pueden dar más información?`;
}
