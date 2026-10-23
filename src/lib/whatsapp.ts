export function normalizePhone(phone: string, countryCode = "593") {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  // Móvil ecuatoriano escrito localmente: 09XXXXXXXX → 593 9XXXXXXXX
  if (digits.length === 10 && digits.startsWith("09")) return `593${digits.slice(1)}`;
  return digits.length <= 8 ? `${countryCode}${digits}` : digits;
}

export function whatsappUrl(phone: string, message = "", countryCode?: string) {
  const number = normalizePhone(phone, countryCode);
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text}`;
}

export function courseMessage(courseTitle: string) {
  return `Hola, me interesa el programa «${courseTitle}» de Épika Academy. ¿Me pueden dar más información?`;
}
