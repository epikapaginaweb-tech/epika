"use client";

import { useState } from "react";
import type { BankAccount } from "@/lib/types";

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-ink/45">{label}</p>
        <p className="truncate font-semibold text-navy">{value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        className="shrink-0 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

export function BankAccounts({ accounts }: { accounts: BankAccount[] }) {
  return (
    <div className="grid gap-3">
      {accounts.map((account, i) => (
        <div key={`${account.bank}-${i}`} className="rounded-2xl border border-line bg-white px-5 py-3">
          <p className="py-2 text-sm font-bold text-orange">{account.bank || "Cuenta bancaria"}</p>
          <div className="divide-y divide-line">
            <CopyValue label="Titular" value={account.holder} />
            <CopyValue label="Cédula / RUC" value={account.idNumber} />
            <CopyValue label="Tipo de cuenta" value={account.accountType} />
            <CopyValue label="Número de cuenta" value={account.account} />
          </div>
        </div>
      ))}
    </div>
  );
}
