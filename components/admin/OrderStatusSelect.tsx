"use client";

import { OrderStatus } from "@/prisma/generated/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  orderId?: string;
  initialStatus?: OrderStatus;
  size?: "sm" | "md";
  disabled?: boolean;
};

const options: Array<{ value: OrderStatus; label: string }> = [
  { value: "HAZIRLANIYOR", label: "Hazırlanıyor" },
  { value: "KARGODA", label: "Kargoda" },
  { value: "TAMAMLANDI", label: "Tamamlandı" },
  { value: "IPTAL_EDILDI", label: "İptal edildi" },
  { value: "IADE_EDILDI", label: "İade edildi" },
];

function labelFor(status: OrderStatus) {
  return options.find((o) => o.value === status)?.label ?? status;
}

function pillClass(status: OrderStatus) {
  switch (status) {
    case "HAZIRLANIYOR":
      return "bg-[rgba(230,215,194,0.5)] text-foreground border-foreground/10";
    case "KARGODA":
      return "bg-[var(--sage)]/15 text-foreground border-[var(--sage)]/25";
    case "TAMAMLANDI":
      return "bg-terracotta/10 text-terracotta border-terracotta/20";
    case "IPTAL_EDILDI":
      return "bg-foreground/5 text-foreground border-foreground/15";
    case "IADE_EDILDI":
      return "bg-[var(--olive)]/12 text-foreground border-[var(--olive)]/22";
    default:
      return "bg-foreground/5 text-foreground border-foreground/10";
  }
}

export default function OrderStatusSelect({
  orderId,
  initialStatus = "HAZIRLANIYOR",
  size = "sm",
  disabled = false,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [saving, setSaving] = useState(false);

  const sizing = size === "md" ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs";
  const classes = useMemo(() => `${sizing} ${pillClass(status)}`, [sizing, status]);

  const update = async (next: OrderStatus) => {
    setStatus(next);
    if (!orderId) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <label
      className="inline-flex items-center gap-2"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <span className={`inline-flex h-fit w-fit rounded-full border font-semibold ${classes}`}>{labelFor(status)}</span>
      <select
        value={status}
        onChange={(e) => update(e.target.value as OrderStatus)}
        disabled={disabled || saving}
        className="h-fit rounded-full border border-foreground/15 bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-terracotta focus:border-terracotta focus:outline-none disabled:opacity-60"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

