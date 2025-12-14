"use client";

import { useMemo, useState } from "react";
import type { OrderStatus } from "@/app/(admin)/panel/siparisler/data";

type Props = {
  initialStatus?: OrderStatus;
  size?: "sm" | "md";
};

const options: OrderStatus[] = ["Hazırlanıyor", "Kargoda", "Tamamlandı", "İptal edildi", "İade edildi"];

function pillClass(status: OrderStatus) {
  switch (status) {
    case "Hazırlanıyor":
      return "bg-[rgba(230,215,194,0.5)] text-foreground border-[rgba(59,43,43,0.12)]";
    case "Kargoda":
      return "bg-[var(--sage)]/15 text-foreground border-[var(--sage)]/25";
    case "Tamamlandı":
      return "bg-terracotta/10 text-terracotta border-terracotta/20";
    case "İptal edildi":
      return "bg-[rgba(59,43,43,0.08)] text-foreground border-[rgba(59,43,43,0.16)]";
    case "İade edildi":
      return "bg-[var(--olive)]/12 text-foreground border-[var(--olive)]/22";
    default:
      return "bg-[rgba(59,43,43,0.06)] text-foreground border-[rgba(59,43,43,0.12)]";
  }
}

export default function OrderStatusSelect({ initialStatus = "Hazırlanıyor", size = "sm" }: Props) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  const sizing = size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs";
  const classes = useMemo(() => `${sizing} ${pillClass(status)}`, [sizing, status]);

  return (
    <label className="inline-flex items-center gap-2">
      <span className={`inline-flex h-fit w-fit rounded-full border font-semibold ${classes}`}>{status}</span>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        className="h-fit rounded-full border border-[rgba(59,43,43,0.16)] bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-terracotta focus:border-terracotta focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

