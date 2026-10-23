import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center text-center">
      <p className="text-8xl font-extrabold tracking-tighter text-orange">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy">No encontramos esta página.</h1>
      <p className="mt-3 text-ink/60">Puede que el programa ya no esté disponible.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-orange">
          Ir al inicio
        </Link>
        <Link href="/programas" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy">
          Ver programas
        </Link>
      </div>
    </main>
  );
}
