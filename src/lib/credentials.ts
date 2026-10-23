export const EMAIL_DOMAIN = "epika.education";

function clean(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

export function splitName(fullName: string) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: words[0] ?? "",
    lastName: (words.length >= 4 ? words[2] : words[1]) ?? "",
  };
}

export function cleanCedula(cedula: string) {
  return cedula.replace(/\D/g, "");
}

export function buildUsername(firstName: string, lastName: string) {
  const first = clean(firstName);
  const last = clean(lastName);
  return first && last ? `${first}.${last}@${EMAIL_DOMAIN}` : "";
}

export function buildPassword(cedula: string) {
  const digits = cleanCedula(cedula);
  return digits ? `Ek${digits}*` : "";
}

export function credentialsMessage(input: {
  firstName: string;
  courseTitle: string | null;
  username: string;
  password: string;
}) {
  const course = input.courseTitle ? ` en «${input.courseTitle}»` : "";
  return [
    `Hola ${input.firstName}, ¡te damos la bienvenida a Épika Academy!`,
    `Tu inscripción${course} está confirmada. Estos son tus datos de acceso:`,
    "",
    `Usuario: ${input.username}`,
    `Contraseña: ${input.password}`,
    "",
    "Guarda este mensaje. Cualquier duda, escríbenos por aquí.",
  ].join("\n");
}
