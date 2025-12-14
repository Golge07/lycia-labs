"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductEditor from "@/components/admin/ProductEditor";
import { SkeletonBlock, SkeletonLine } from "@/components/admin/Skeleton";

type Detail = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  tag: string | null;
  category: string | null;
  stock: number;
  images: any;
  active: boolean;
};

export default function PanelUrunDetay() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Detail | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    let alive = true;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/products/${id}`, { method: "GET", cache: "no-store", credentials: "include" })
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message || "Ürün bulunamadı.");
        return json as Detail;
      })
      .then((json) => {
        if (!alive) return;
        setProduct(json);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Ürün bulunamadı.");
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
            <SkeletonLine className="mt-2 h-3 w-24" />
          </div>
          <div className="flex gap-2">
            <SkeletonLine className="h-9 w-36 rounded-full" />
            <SkeletonLine className="h-9 w-32 rounded-full" />
          </div>
        </div>
        <SkeletonBlock className="h-[520px] w-full" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 text-sm text-foreground shadow-sm">
        {error ?? "Ürün bulunamadı."}{" "}
        <Link href="/panel/urunler" className="font-semibold text-terracotta hover:underline">
          Ürünlere dön
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? (product.images as any[]) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Ürün Detayı</p>
          <p className="mt-1 text-sm text-foreground/65">ID: {product.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/panel/urunler"
            className="rounded-full border border-foreground/20 bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Ürünlere dön
          </Link>
          <Link
            href={`/magaza/${product.id}`}
            className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Mağazada gör
          </Link>
        </div>
      </div>

      <ProductEditor
        mode="edit"
        initial={{
          id: product.id,
          title: product.title,
          price: String(product.price),
          tag: product.tag ?? "",
          category: product.category ?? "bakim",
          stock: product.stock,
          description: product.description ?? "",
          images: images.filter((x) => typeof x === "string") as string[],
          active: product.active,
        }}
      />
    </div>
  );
}

