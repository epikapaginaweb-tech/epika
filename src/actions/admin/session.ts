"use server";

import { redirect } from "next/navigation";
import { credentialsMatch, endSession, startSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!credentialsMatch(username, password)) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Usuario o contraseña incorrectos." };
  }

  await startSession(username);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
