"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SkeletonBlock, SkeletonLine } from "@/components/admin/Skeleton";

type Detail = {
  user: {
    id: string;
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
    created_at: string;
  };
  orders: Array<{
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
  }>;
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

function statusLabel(status: string) {
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

export default function MusteriDetay() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Detail | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/customers/${encodeURIComponent(id)}`, { method: "GET", cache: "no-store", credentials: "include" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Müşteri bulunamadı.");
        return json as Detail;
      })
      .then((json) => {
        if (!alive) return;
        setData(json);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Müşteri bulunamadı.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <SkeletonLine className="h-7 w-44" />
            <SkeletonLine className="mt-2 h-3 w-56" />
          </div>
          <SkeletonLine className="h-9 w-40 rounded-full" />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
            <SkeletonLine className="h-4 w-28" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
                  <SkeletonLine className="h-3 w-20" />
                  <SkeletonLine className="mt-3 h-4 w-40" />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="mt-3 h-4 w-72" />
              <SkeletonLine className="mt-2 h-4 w-56" />
            </div>
          </div>

          <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
            <SkeletonLine className="h-4 w-28" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <SkeletonLine className="h-4 w-44" />
                    <SkeletonLine className="h-4 w-24" />
                  </div>
                  <SkeletonLine className="mt-2 h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 text-sm text-foreground shadow-sm">
        {error ?? "Müşteri bulunamadı."}{" "}
        <Link href="/panel/musteriler" className="font-semibold text-terracotta hover:underline">
          Müşterilere dön
        </Link>
      </div>
    );
  }

  const u = data.user;
  const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  const address = [u.address_line1, u.address_line2].filter(Boolean).join(" ").trim();
  const location = [u.district, u.city].filter(Boolean).join(", ").trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Müşteri Detayı</p>
          <p className="mt-1 text-sm text-foreground/65">ID: {u.id}</p>
        </div>
        <Link
          href="/panel/musteriler"
          className="rounded-full border border-foreground/20 bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
        >
          Müşterilere dön
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
          <p className="heading-font text-lg text-foreground">Bilgiler</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Kullanıcı</p>
              <p className="mt-1 font-semibold text-foreground">{u.username}</p>
              {fullName ? <p className="mt-1 text-sm text-foreground/70">{fullName}</p> : null}
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">E-posta</p>
              <p className="mt-1 truncate font-semibold text-foreground">{u.email}</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Telefon</p>
              <p className="mt-1 font-semibold text-foreground">{u.phone ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Kayıt</p>
              <p className="mt-1 font-semibold text-foreground">{new Date(u.created_at).toLocaleString("tr-TR")}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Adres</p>
            <p className="mt-1 text-sm text-foreground/80">{address || "-"}</p>
            <p className="mt-1 text-sm text-foreground/70">{location || "-"}</p>
            {u.postal_code ? <p className="mt-1 text-sm text-foreground/70">{u.postal_code}</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
          <p className="heading-font text-lg text-foreground">Siparişler</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
            <div className="grid grid-cols-[1fr_0.9fr_0.9fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              <span>Sipariş</span>
              <span>Tarih</span>
              <span>Tutar</span>
            </div>
            <div className="divide-y divide-foreground/10">
              {data.orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/panel/siparisler/${encodeURIComponent(o.id)}`}
                  className="grid grid-cols-[1fr_0.9fr_0.9fr] gap-3 px-4 py-3 text-sm text-foreground/80 transition hover:bg-[rgba(230,215,194,0.25)]"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{o.id}</p>
                    <p className="text-xs text-foreground/60">{statusLabel(o.status)}</p>
                  </div>
                  <p className="text-foreground/70">{new Date(o.created_at).toLocaleDateString("tr-TR")}</p>
                  <p className="font-semibold text-terracotta">{formatMoney(o.total_amount)}</p>
                </Link>
              ))}
              {data.orders.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-foreground/65">Henüz sipariş yok.</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
