"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store";

type OrderDetail = {
  id: string;
  status: string;
  created_at: string;
  total: number;
  meta: any;
  items: Array<{
    id: string;
    product_id: number | null;
    title: string;
    image_url: string | null;
    unit_price: number;
    quantity: number;
    line_total: number;
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

export default function ProfilSiparisDetay() {
  const user = useAppSelector((s) => s.user.user);
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canShow = useMemo(() => !!user, [user]);

  useEffect(() => {
    if (!user || !id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/orders/${encodeURIComponent(id)}`, { method: "GET" })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "failed");
        return data as OrderDetail;
      })
      .then((data) => setOrder(data))
      .catch(() => setError("Sipariş bulunamadı."))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (!canShow) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 shadow-sm">
        <p className="heading-font text-lg text-foreground">Giriş gerekli</p>
        <p className="mt-1 text-sm text-foreground/80">Sipariş detayı için giriş yapmalısın.</p>
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Sipariş Detayı</p>
          <p className="mt-1 text-sm text-foreground/65">ID: {id}</p>
        </div>
        <Link href="/profil/siparisler" className="text-sm font-semibold text-terracotta hover:underline">
          Siparişlere dön
        </Link>
      </div>

      {loading ? <p className="mt-4 text-sm text-foreground/65">Yükleniyor…</p> : null}
      {error ? (
        <div className="mt-4 rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
          {error}
        </div>
      ) : null}

      {order ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-foreground">
                Durum: <span className="text-terracotta">{statusLabel(order.status)}</span>
              </p>
              <p className="text-sm text-foreground/70">{new Date(order.created_at).toLocaleString("tr-TR")}</p>
            </div>
            <p className="mt-2 text-sm text-foreground/70">
              Toplam: <span className="font-semibold text-foreground">{formatMoney(order.total)}</span>
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
            <div className="grid grid-cols-[1fr_90px_90px_90px] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              <span>Ürün</span>
              <span>Adet</span>
              <span>Birim</span>
              <span>Tutar</span>
            </div>
            <div className="divide-y divide-foreground/10">
              {order.items.map((i) => (
                <div key={i.id} className="grid grid-cols-[1fr_90px_90px_90px] gap-3 px-4 py-3 text-sm text-foreground/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg border border-foreground/10 bg-white/70">
                      {i.image_url ? <img src={i.image_url} alt={i.title} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{i.title}</p>
                      {i.product_id ? <p className="text-xs text-foreground/60">ID: {i.product_id}</p> : null}
                    </div>
                  </div>
                  <p className="text-foreground/70">{i.quantity}</p>
                  <p className="text-foreground/70">{formatMoney(i.unit_price)}</p>
                  <p className="font-semibold text-terracotta">{formatMoney(i.line_total)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
