"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { OrderStatus } from "@/prisma/generated/client";
import { SkeletonBlock, SkeletonLine } from "@/components/admin/Skeleton";

type DashboardData = {
  stats: {
    dailyRevenue: number;
    totalRevenue: number;
    dailyOrders: number;
    totalOrders: number;
    canceledToday: number;
    avgBasket: number;
  };
  distribution: Array<{ status: OrderStatus; count: number; percent: number }>;
  recentOrders: Array<{ id: string; created_at: string; status: OrderStatus; total: number; username: string | null }>;
};

type Stat = {
  label: string;
  value: string;
  hint: string;
  tone: "terracotta" | "sage" | "olive" | "sand";
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

function labelForStatus(status: OrderStatus) {
  switch (status) {
    case "HAZIRLANIYOR":
      return "Hazırlanıyor";
    case "KARGODA":
      return "Kargoda";
    case "TAMAMLANDI":
      return "Tamamlandı";
    case "IPTAL_EDILDI":
      return "İptal edildi";
    case "IADE_EDILDI":
      return "İade edildi";
    default:
      return status;
  }
}

const toneStyles: Record<Stat["tone"], string> = {
  terracotta: "bg-terracotta/10 border-terracotta/20",
  sage: "bg-[var(--sage)]/10 border-[var(--sage)]/20",
  olive: "bg-[var(--olive)]/10 border-[var(--olive)]/20",
  sand: "bg-sand/40 border-sand/60",
};

export default function PanelDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch("/api/admin/dashboard", { method: "GET", cache: "no-store", credentials: "include" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Dashboard yüklenemedi.");
        return json as DashboardData;
      })
      .then((json) => {
        if (!alive) return;
        setData(json);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Dashboard yüklenemedi.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const stats: Stat[] = useMemo(
    () => [
      {
        label: "Günlük Ciro",
        value: formatMoney(data?.stats.dailyRevenue ?? 0),
        hint: "Bugün",
        tone: "terracotta",
      },
      {
        label: "Toplam Ciro",
        value: formatMoney(data?.stats.totalRevenue ?? 0),
        hint: "Toplam",
        tone: "sage",
      },
      {
        label: "Günlük Sipariş",
        value: String(data?.stats.dailyOrders ?? 0),
        hint: `İptal: ${data?.stats.canceledToday ?? 0}`,
        tone: "olive",
      },
      {
        label: "Toplam Sipariş",
        value: String(data?.stats.totalOrders?.toLocaleString("tr-TR") ?? "0"),
        hint: `Ortalama sepet: ${formatMoney(data?.stats.avgBasket ?? 0)}`,
        tone: "sand",
      },
    ],
    [data],
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-3xl border border-foreground/10 bg-white/60 p-5 shadow-sm">
              <SkeletonLine className="h-3 w-28" />
              <SkeletonLine className="mt-3 h-8 w-32" />
              <SkeletonLine className="mt-3 h-3 w-24" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="mt-2 h-3 w-56" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <SkeletonLine className="h-3 w-28" />
                    <SkeletonLine className="h-3 w-10" />
                  </div>
                  <SkeletonBlock className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
            <div className="flex items-end justify-between gap-3">
              <div>
                <SkeletonLine className="h-4 w-36" />
                <SkeletonLine className="mt-2 h-3 w-28" />
              </div>
              <SkeletonLine className="h-9 w-28 rounded-full" />
            </div>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-foreground/10 bg-white/80">
              <div className="min-w-[820px]">
                <div className="grid grid-cols-4 gap-3 border-b border-foreground/10 px-4 py-3">
                  <SkeletonLine className="h-3 w-20" />
                  <SkeletonLine className="h-3 w-24" />
                  <SkeletonLine className="h-3 w-16" />
                  <SkeletonLine className="h-3 w-20" />
                </div>
                <div className="divide-y divide-foreground/10">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="grid grid-cols-4 items-center gap-3 px-4 py-4">
                      <SkeletonLine className="h-4 w-40" />
                      <SkeletonLine className="h-4 w-44" />
                      <SkeletonLine className="h-4 w-24" />
                      <SkeletonLine className="h-6 w-24 justify-self-end rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 text-sm text-foreground shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl border p-5 shadow-sm transition hover:shadow-md ${toneStyles[s.tone]}`}>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">{s.label}</p>
            <p className="mt-2 heading-font text-3xl text-foreground">{s.value}</p>
            <p className="mt-2 text-sm text-foreground/70">{s.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="heading-font text-lg text-foreground">Sipariş Dağılımı</p>
              <p className="text-sm text-foreground/65">Durum bazlı oranlar</p>
            </div>
            <p className="text-sm text-foreground/65">Toplam</p>
          </div>

          <div className="mt-5 space-y-3">
            {(data?.distribution ?? []).map((row) => (
              <div key={row.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-foreground/80">
                  <span className="font-semibold text-foreground">{labelForStatus(row.status)}</span>
                  <span>{row.percent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full bg-terracotta/80" style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
            {(data?.distribution ?? []).length === 0 ? <p className="text-sm text-foreground/65">Henüz veri yok.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="heading-font text-lg text-foreground">Son Siparişler</p>
              <p className="text-sm text-foreground/65">Hızlı kontrol</p>
            </div>
            <Link
              href="/panel/siparisler"
              className="rounded-full border border-foreground/20 bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Tümünü gör
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
            <div className="overflow-x-auto">
              <div className="min-w-[820px]">
                <div className="grid grid-cols-[1fr_1.2fr_0.7fr_0.9fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
                  <span>Sipariş</span>
                  <span>Müşteri</span>
                  <span>Tutar</span>
                  <span>Durum</span>
                </div>
                <div className="divide-y divide-foreground/10">
                  {(data?.recentOrders ?? []).map((o) => (
                    <Link
                      key={o.id}
                      href={`/panel/siparisler/${encodeURIComponent(o.id)}`}
                      className="grid grid-cols-[1fr_1.2fr_0.7fr_0.9fr] gap-3 px-4 py-3 text-sm text-foreground/80 transition hover:bg-[rgba(230,215,194,0.25)]"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{o.id}</p>
                        <p className="text-xs text-foreground/60">{new Date(o.created_at).toLocaleString("tr-TR")}</p>
                      </div>
                      <p className="font-medium text-foreground">{o.username ?? "-"}</p>
                      <p className="font-semibold text-terracotta">{formatMoney(o.total)}</p>
                      <span className="inline-flex h-fit w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
                        {labelForStatus(o.status)}
                      </span>
                    </Link>
                  ))}

                  {(data?.recentOrders ?? []).length === 0 ? (
                    <div className="px-4 py-10 text-center text-sm text-foreground/65">Henüz sipariş yok.</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
