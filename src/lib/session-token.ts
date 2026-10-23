import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "epika_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET ?? "";
  if (value.length < 32) return null;
  return new TextEncoder().encode(value);
}

export async function signSession(username: string) {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET debe tener al menos 32 caracteres.");
  return new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function verifySession(token: string | undefined) {
  const key = secret();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.role === "admin" && typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
