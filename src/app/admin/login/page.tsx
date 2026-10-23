import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-[0_40px_80px_-40px_rgba(0,41,82,0.35)]">
        <Image src="/brand/logo.png" alt="Épika Academy" width={1459} height={470} className="h-10 w-auto" />
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-navy">Panel administrativo</h1>
        <p className="mt-1 text-sm text-ink/55">Acceso solo para el equipo de Épika.</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
