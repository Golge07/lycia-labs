"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/lib/store";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  item_count: number;
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

export default function ProfilSiparisler() {
  const user = useAppSelector((s) => s.user.user);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canShow = useMemo(() => !!user, [user]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    fetch("/api/orders", { method: "GET" })
      .then(async (res) => {
        if (!res.ok) throw new Error("failed");
        return (await res.json()) as OrderRow[];
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setError("Siparişler yüklenemedi."))
      .finally(() => setLoading(false));
  }, [user]);

  if (!canShow) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 shadow-sm">
        <p className="heading-font text-lg text-foreground">Giriş gerekli</p>
        <p className="mt-1 text-sm text-foreground/80">Siparişlerini görmek için giriş yapman gerekiyor.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/login"
            className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
      <div>
        <p className="heading-font text-2xl text-foreground">Siparişler</p>
        <p className="mt-1 text-sm text-foreground/65">Hesabına ait siparişler</p>
      </div>

      {loading ? <p className="mt-4 text-sm text-foreground/65">Yükleniyor…</p> : null}
      {error ? (
        <div className="mt-4 rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
          {error}
        </div>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
        <div className="grid grid-cols-[1fr_0.9fr_0.9fr_0.9fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
          <span>Sipariş</span>
          <span>Tarih</span>
          <span>Tutar</span>
          <span>Durum</span>
        </div>
        <div className="divide-y divide-foreground/10">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/profil/siparisler/${encodeURIComponent(o.id)}`}
              className="grid grid-cols-[1fr_0.9fr_0.9fr_0.9fr] gap-3 px-4 py-3 text-sm text-foreground/80 transition hover:bg-[rgba(230,215,194,0.25)]"
            >
              <p className="font-semibold text-foreground">{o.id}</p>
              <p className="text-foreground/70">{new Date(o.created_at).toLocaleString("tr-TR")}</p>
              <p className="font-semibold text-terracotta">{formatMoney(o.total)}</p>
              <span className="inline-flex h-fit w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
                {statusLabel(o.status)}
              </span>
            </Link>
          ))}

          {!loading && orders.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-foreground/65">Henüz sipariş yok.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
