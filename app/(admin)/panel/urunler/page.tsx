"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SkeletonTable, SkeletonLine } from "@/components/admin/Skeleton";

type ProductRow = {
  id: number;
  title: string;
  price: number;
  tag: string | null;
  stock: number;
  active: boolean;
  images: any;
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

function statusFromStock(stock: number, active: boolean) {
  if (!active) return "Pasif";
  if (stock <= 0) return "Tükendi";
  if (stock < 20) return "Az stok";
  return "Aktif";
}

export default function PanelUrunler() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch("/api/admin/products", { method: "GET", cache: "no-store", credentials: "include" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Ürünler yüklenemedi.");
        return json as ProductRow[];
      })
      .then((json) => {
        if (!alive) return;
        setProducts(Array.isArray(json) ? json : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Ürünler yüklenemedi.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

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
        <div className="grid grid-cols-[0.7fr_1.6fr_0.7fr_0.6fr_0.7fr] gap-3 border-b border-foreground/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
          <span>ID</span>
          <span>Ürün</span>
          <span>Fiyat</span>
          <span>Stok</span>
          <span>Durum</span>
        </div>
        <div className="divide-y divide-foreground/10">
          {products.map((p) => {
            const images = Array.isArray(p.images) ? (p.images as any[]) : [];
            const cover = typeof images[0] === "string" ? (images[0] as string) : "/5.png";
            const status = statusFromStock(p.stock, p.active);
            return (
              <Link
                key={p.id}
                href={`/panel/urunler/${p.id}`}
                className="grid grid-cols-[0.7fr_1.6fr_0.7fr_0.6fr_0.7fr] items-center gap-3 px-4 py-3 text-sm text-foreground/80 transition hover:bg-[rgba(230,215,194,0.25)]"
              >
                <p className="font-semibold text-foreground">{p.id}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-foreground/10 bg-white/70">
                    <img src={cover} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-foreground/60">{p.tag ?? "-"}</p>
                  </div>
                </div>
                <p className="font-semibold text-terracotta">{formatMoney(p.price)}</p>
                <p className="font-semibold text-foreground">{p.stock}</p>
                <span className="inline-flex h-fit w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
                  {status}
                </span>
              </Link>
            );
          })}

          {products.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-foreground/65">Henüz ürün yok.</div>
          ) : null}
        </div>
      </div>
    );
  }, [error, loading, products]);

  return (
    <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Ürün Yönetimi</p>
          <p className="mt-1 text-sm text-foreground/65">Ürün detay, stok ve içerik düzenleme</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/panel/urunler/yeni"
            className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Yeni ürün
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-3 flex items-center justify-between text-sm text-foreground/65">
          <SkeletonLine className="h-3 w-36" />
          <SkeletonLine className="h-3 w-20" />
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-foreground/65">
          <p>
            Gösterilen: <span className="font-semibold text-foreground">{products.length}</span>
          </p>
        </div>
      )}

      {ui}
    </div>
  );
}
