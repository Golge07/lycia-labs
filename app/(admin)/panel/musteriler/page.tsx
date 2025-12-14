"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SkeletonTable, SkeletonLine } from "@/components/admin/Skeleton";

type CustomerRow = {
  id: string;
  username: string;
  email: string;
  orders: number;
  lastOrderAt: string | null;
  created_at: string;
};

function segmentFromOrders(count: number) {
  if (count >= 20) return "VIP";
  if (count >= 5) return "Standart";
  return "Yeni";
}

export default function PanelMusteriler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const [query, setQuery] = useState(q);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  useEffect(() => setQuery(q), [q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Müşteriler yüklenemedi.");
        return json as CustomerRow[];
      })
      .then((json) => {
        if (!alive) return;
        setCustomers(Array.isArray(json) ? json : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Müşteriler yüklenemedi.");
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
    router.push(next ? `/panel/musteriler?q=${encodeURIComponent(next)}` : "/panel/musteriler");
  };

  const ui = useMemo(() => {
    if (loading) return <SkeletonTable rows={7} />;
    if (error) {
      return (
        <div className="mt-5 rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 text-sm text-foreground shadow-sm">
          {error}
        </div>
      );
    }

    return (
      <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
        <div className="grid grid-cols-[1.2fr_1.8fr_0.8fr_0.6fr_0.9fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
          <span>Kullanıcı</span>
          <span>E-posta</span>
          <span>Segment</span>
          <span>Sipariş</span>
          <span>Son</span>
        </div>
        <div className="divide-y divide-foreground/10">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/panel/musteriler/${encodeURIComponent(c.id)}`}
              className="grid grid-cols-[1.2fr_1.8fr_0.8fr_0.6fr_0.9fr] gap-3 px-4 py-3 text-sm text-foreground/80 transition hover:bg-[rgba(230,215,194,0.25)]"
            >
              <p className="truncate font-semibold text-foreground">{c.username}</p>
              <p className="truncate text-foreground/75">{c.email}</p>
              <span className="inline-flex h-fit w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
                {segmentFromOrders(c.orders)}
              </span>
              <p className="font-semibold text-terracotta">{c.orders}</p>
              <p className="text-foreground/70">{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString("tr-TR") : "-"}</p>
            </Link>
          ))}

          {customers.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-foreground/65">Sonuç bulunamadı.</div>
          ) : null}
        </div>
      </div>
    );
  }, [customers, error, loading]);

  return (
    <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Müşteri Hesapları</p>
          <p className="mt-1 text-sm text-foreground/65">Kayıtlar ve sipariş geçmişi</p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E-posta veya kullanıcı adı"
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
            Gösterilen: <span className="font-semibold text-foreground">{customers.length}</span>
          </p>
          {q ? (
            <Link href="/panel/musteriler" className="text-terracotta hover:underline">
              Aramayı temizle
            </Link>
          ) : null}
        </div>
      )}

      {ui}
    </div>
  );
}

