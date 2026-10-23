import type { InquiryStatus, PaymentStatus } from "@/lib/types";

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  nueva: "Nueva",
  contactada: "Contactada",
  inscrita: "Inscrita",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  sin_comprobante: "Sin comprobante",
  en_revision: "Por revisar",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

const STATUS_STYLE: Record<InquiryStatus, string> = {
  nueva: "bg-orange text-white",
  contactada: "bg-navy/10 text-navy",
  inscrita: "bg-whatsapp/15 text-[#128c4a]",
};

const PAYMENT_STYLE: Record<PaymentStatus, string> = {
  sin_comprobante: "bg-paper text-ink/50",
  en_revision: "bg-orange-soft text-[#b35f00]",
  aprobado: "bg-whatsapp/15 text-[#128c4a]",
  rechazado: "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${PAYMENT_STYLE[status]}`}>{PAYMENT_LABEL[status]}</span>;
}
