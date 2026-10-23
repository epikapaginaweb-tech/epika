import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/actions/admin/session";
import { AdminNav } from "@/components/admin/AdminNav";

function Loading() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="h-10 w-64 animate-pulse rounded-2xl bg-white" />
      <div className="h-72 animate-pulse rounded-3xl bg-white" />
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)] gap-6 p-4 md:p-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
      <aside className="min-w-0 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)]">
        <div className="flex h-full flex-col gap-5 rounded-3xl bg-paper lg:py-2">
          <div className="flex items-center justify-between">
            <Link href="/admin">
              <Image src="/brand/logo.png" alt="Épika Academy" width={1459} height={470} className="h-9 w-auto" />
            </Link>
            <Link href="/" target="_blank" className="text-xs font-semibold text-ink/50 hover:text-orange lg:hidden">
              Ver sitio ↗
            </Link>
          </div>
          <AdminNav />
          <div className="mt-auto hidden space-y-2 lg:block">
            <Link href="/" target="_blank" className="block rounded-2xl px-4 py-2.5 text-sm font-semibold text-ink/60 hover:bg-white hover:text-navy">
              Ver sitio ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="w-full rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-white">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0">
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <form action={logout} className="mt-10 lg:hidden">
          <button type="submit" className="text-sm font-semibold text-red-600">
            Cerrar sesión
          </button>
        </form>
      </main>
    </div>
  );
}
