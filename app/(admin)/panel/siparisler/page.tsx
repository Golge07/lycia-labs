"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { OrderStatus } from "@/prisma/generated/client";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { SkeletonTable, SkeletonLine } from "@/components/admin/Skeleton";

type Row = {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  item_count: number;
  user: { id: string; username: string; email: string; phone: string | null };
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default function PanelSiparisler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const [query, setQuery] = useState(q);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Row[]>([]);

  useEffect(() => setQuery(q), [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/orders${q ? `?q=${encodeURIComponent(q)}` : ""}`, { method: "GET", cache: "no-store", credentials: "include" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Siparişler yüklenemedi.");
        return json as Row[];
      })
      .then((json) => {
        if (!alive) return;
        setOrders(Array.isArray(json) ? json : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Siparişler yüklenemedi.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [q]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = query.trim();
    router.push(next ? `/panel/siparisler?q=${encodeURIComponent(next)}` : "/panel/siparisler");
  };

  const ui = useMemo(() => {
    if (loading) return <SkeletonTable rows={8} />;
    if (error) {
      return (
        <div className="mt-5 rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 text-sm text-foreground shadow-sm">
          {error}
        </div>
      );
    }

    return (
      <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
        <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.9fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
          <span>Sipariş</span>
          <span>Müşteri</span>
          <span>Tutar</span>
          <span>Durum</span>
        </div>
        <div className="divide-y divide-foreground/10">
          {orders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[1fr_1.2fr_0.8fr_0.9fr] items-center gap-3 px-4 py-3 text-sm text-foreground/80 transition hover:bg-[rgba(230,215,194,0.25)]"
            >
              <Link href={`/panel/siparisler/${encodeURIComponent(o.id)}`} className="contents">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{o.id}</p>
                  <p className="text-xs text-foreground/60">{new Date(o.created_at).toLocaleString("tr-TR")}</p>
                </div>
                <p className="font-medium text-foreground">{o.user?.username ?? "-"}</p>
                <p className="font-semibold text-terracotta">{formatMoney(o.total)}</p>
              </Link>

              <div className="flex justify-end">
                <OrderStatusSelect orderId={o.id} initialStatus={o.status} />
              </div>
            </div>
          ))}

          {orders.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-foreground/65">Sonuç bulunamadı.</div>
          ) : null}
        </div>
      </div>
    );
  }, [error, loading, orders]);

  return (
    <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Siparişler</p>
          <p className="mt-1 text-sm text-foreground/65">Sipariş ID ile arama</p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sipariş ID"
            className="w-full rounded-full border border-foreground/20 bg-white/90 px-4 py-2 text-sm text-foreground placeholder:text-foreground/45 focus:border-terracotta focus:outline-none"
          />
          <button className="shrink-0 rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg">
            Ara
          </button>
        </form>
      </div>

      {loading ? (
        <div className="mt-3 flex items-center justify-between text-sm text-foreground/65">
          <SkeletonLine className="h-3 w-36" />
          <SkeletonLine className="h-3 w-20" />
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-foreground/65">
          <p>
            Gösterilen: <span className="font-semibold text-foreground">{orders.length}</span>
          </p>
          {q ? (
            <Link href="/panel/siparisler" className="text-terracotta hover:underline">
              Aramayı temizle
            </Link>
          ) : null}
        </div>
      )}

      {ui}
    </div>
  );
}
