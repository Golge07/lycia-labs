"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { OrderStatus } from "@/prisma/generated/client";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { SkeletonBlock, SkeletonLine } from "@/components/admin/Skeleton";

type Detail = {
  id: string;
  status: OrderStatus;
  created_at: string;
  total_amount: number;
  note: string | null;
  meta: any;
  user: {
    username: string;
    email: string;
    phone: string | null;
    first_name: string | null;
    last_name: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    district: string | null;
    postal_code: string | null;
    country: string | null;
  };
  items: Array<{ id: string; title: string; quantity: number; unit_price: number; line_total: number }>;
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

function shippingFromMeta(meta: unknown): number | null {
  if (!meta || typeof meta !== "object") return null;
  const value = (meta as any).shipping;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function addressFromMeta(meta: unknown) {
  if (!meta || typeof meta !== "object") return null;
  const value = (meta as any).address;
  return value && typeof value === "object" ? value : null;
}

export default function SiparisDetay() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Detail | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { method: "GET", cache: "no-store", credentials: "include" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Sipariş bulunamadı.");
        return json as Detail;
      })
      .then((json) => {
        if (!alive) return;
        setOrder(json);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Sipariş bulunamadı.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const view = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <SkeletonLine className="h-7 w-44" />
              <SkeletonLine className="mt-2 h-3 w-56" />
            </div>
            <div className="flex gap-2">
              <SkeletonLine className="h-9 w-40 rounded-full" />
              <SkeletonLine className="h-9 w-44 rounded-full" />
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
              <SkeletonLine className="h-4 w-28" />
              <div className="mt-4 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
                <div className="grid grid-cols-4 gap-3 border-b border-foreground/10 px-4 py-3">
                  <SkeletonLine className="h-3 w-20" />
                  <SkeletonLine className="h-3 w-14" />
                  <SkeletonLine className="h-3 w-14" />
                  <SkeletonLine className="h-3 w-14" />
                </div>
                <div className="divide-y divide-foreground/10">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="grid grid-cols-4 items-center gap-3 px-4 py-4">
                      <SkeletonLine className="h-4 w-52" />
                      <SkeletonLine className="h-4 w-10" />
                      <SkeletonLine className="h-4 w-20" />
                      <SkeletonLine className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <SkeletonBlock className="mt-4 h-20 w-full" />
            </div>

            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
                  <SkeletonLine className="h-4 w-24" />
                  <div className="mt-3 space-y-2">
                    <SkeletonLine className="h-3 w-52" />
                    <SkeletonLine className="h-3 w-44" />
                    <SkeletonLine className="h-3 w-60" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (error || !order) {
      return (
        <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 text-sm text-foreground shadow-sm">
          {error ?? "Sipariş bulunamadı."}{" "}
          <Link href="/panel/siparisler" className="font-semibold text-terracotta hover:underline">
            Siparişlere dön
          </Link>
        </div>
      );
    }

    const subtotal = order.items.reduce((sum, i) => sum + i.line_total, 0);
    const shipping = shippingFromMeta(order.meta) ?? (subtotal >= 1000 ? 0 : 49);
    const total = order.total_amount;
    const metaAddress = addressFromMeta(order.meta);

    const name =
      [order.user?.first_name, order.user?.last_name].filter(Boolean).join(" ").trim() || order.user?.username || "-";

    const phone = (metaAddress?.phone as string | null) ?? order.user?.phone ?? "-";
    const city = (metaAddress?.city as string | null) ?? order.user?.city ?? "-";
    const district = (metaAddress?.district as string | null) ?? order.user?.district ?? "-";
    const addressLine1 = (metaAddress?.address_line1 as string | null) ?? order.user?.address_line1 ?? "";
    const addressLine2 = (metaAddress?.address_line2 as string | null) ?? order.user?.address_line2 ?? "";
    const postalCode = (metaAddress?.postal_code as string | null) ?? order.user?.postal_code ?? "";

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="heading-font text-2xl text-foreground">Sipariş Detayı</p>
            <p className="mt-1 text-sm text-foreground/65">
              {order.id} • {new Date(order.created_at).toLocaleString("tr-TR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/panel/siparisler"
              className="rounded-full border border-foreground/20 bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Siparişlere dön
            </Link>
            <OrderStatusSelect orderId={order.id} initialStatus={order.status} size="md" />
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
            <p className="heading-font text-lg text-foreground">Ürünler</p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
              <div className="grid grid-cols-[1.6fr_0.4fr_0.6fr_0.6fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
                <span>Ürün</span>
                <span>Adet</span>
                <span>Birim</span>
                <span>Tutar</span>
              </div>
              <div className="divide-y divide-foreground/10">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1.6fr_0.4fr_0.6fr_0.6fr] gap-3 px-4 py-3 text-sm"
                  >
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="font-semibold text-foreground">{item.quantity}</p>
                    <p className="text-foreground/75">{formatMoney(item.unit_price)}</p>
                    <p className="font-semibold text-terracotta">{formatMoney(item.line_total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {order.note ? (
              <div className="mt-4 rounded-2xl border border-foreground/10 bg-[rgba(230,215,194,0.28)] p-4 text-sm text-foreground/80">
                <p className="font-semibold text-foreground">Not</p>
                <p className="mt-1">{order.note}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
              <p className="heading-font text-lg text-foreground">Müşteri</p>
              <div className="mt-3 space-y-2 text-sm text-foreground/80">
                <p>
                  <span className="font-semibold text-foreground">Ad:</span> {name}
                </p>
                <p>
                  <span className="font-semibold text-foreground">E-posta:</span> {order.user?.email ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Telefon:</span> {phone}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
              <p className="heading-font text-lg text-foreground">Teslimat</p>
              <div className="mt-3 space-y-2 text-sm text-foreground/80">
                <p className="font-semibold text-foreground">
                  {district}, {city} {postalCode ? `(${postalCode})` : ""}
                </p>
                <p>{addressLine1}</p>
                {addressLine2 ? <p>{addressLine2}</p> : null}
              </div>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
              <p className="heading-font text-lg text-foreground">Özet</p>
              <div className="mt-3 space-y-2 text-sm text-foreground/80">
                <div className="flex items-center justify-between">
                  <span>Ara toplam</span>
                  <span className="font-semibold text-foreground">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kargo</span>
                  <span className="font-semibold text-foreground">{formatMoney(shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-foreground/10 pt-2">
                  <span className="font-semibold text-foreground">Toplam</span>
                  <span className="font-semibold text-terracotta">{formatMoney(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }, [error, loading, order]);

  return view;
}
