"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Product, products } from "../data";
import { BiMinus, BiPlus } from "react-icons/bi";

type Props = {
  params: Promise<{ id: string }>;
};

const galleryFallbacks = ["/5.png", "/6.png", "/7.png", "/3.png"];

export default function UrunDetay({ params: pparams }: Props) {
  const [product, setProduct] = useState<Product | undefined>();
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    pparams.then((response) => {
      const found = products.find((p) => p.id === Number(response.id));
      setProduct(found);
      setResolved(true);
    });
  }, [pparams]);

  if (resolved && !product) return notFound();

  const gallery = useMemo(() => {
    const base = product?.img ? [product.img] : [];
    return [...base, ...galleryFallbacks.filter((g) => !base.includes(g))].slice(0, 4);
  }, [product?.img]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (!product) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[-10%] h-72 w-72 rounded-full bg-[rgba(167,68,68,0.08)] blur-3xl" />
        <div className="absolute right-[-10%] top-10 h-80 w-80 rounded-full bg-[rgba(143,188,163,0.08)] blur-3xl" />
      </div>

      <main className="relative z-10 space-y-10 px-6 pb-16 pt-10 md:px-10 lg:px-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Ürün Detayı</p>
            <h1 className="heading-font text-4xl text-foreground">{product.title}</h1>
            <p className="text-sm text-[rgba(59,43,43,0.65)]">{product.category.toUpperCase()}</p>
          </div>
          <Link
            href="/magaza"
            className="rounded-full border border-[rgba(59,43,43,0.2)] px-4 py-2 text-sm text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            ← Mağazaya dön
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img src={gallery[selectedImage] || "/5.png"} alt={product.title} className="h-[420px] w-full object-cover" />
              <button
                onClick={() => setFavorite((f) => !f)}
                className="absolute right-3 top-3 rounded-full border border-[rgba(59,43,43,0.12)] bg-white/90 px-3 py-1 text-xs font-semibold text-terracotta shadow-sm transition hover:bg-terracotta hover:text-white"
              >
                {favorite ? "Favoride" : "Favori"}
              </button>
            </div>
            <div className="flex gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={img || idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-20 w-24 overflow-hidden rounded-xl border transition ${selectedImage === idx
                    ? "border-terracotta shadow-md"
                    : "border-[rgba(59,43,43,0.12)] hover:border-terracotta/60"
                    }`}
                >
                  <img src={img || "/5.png"} alt={`${product.title} ${idx}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl p-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                {product.tag}
              </span>
              <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                {product.category.toUpperCase()}
              </span>
            </div>
            <p className="heading-font text-3xl text-foreground">{product.title}</p>
            <p className="text-[rgba(59,43,43,0.75)]">
              {product.description ||
                "Temiz içerikler ve dengeli formüllerle tasarlanmış, cildinize nazik ama etkili bir bakım sunar."}
            </p>
            <p className="text-2xl font-semibold text-terracotta">{product.price}</p>
            <div className="grid gap-2 text-sm text-[rgba(59,43,43,0.7)]">
              <span>• Bitkisel içerikler, temiz formül</span>
              <span>• Gönderim: 2-4 iş günü, iade: 30 gün</span>
              <span>• Güvenli ödeme altyapısı</span>
            </div>

            <div className="grid gap-3 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-[rgba(143,188,163,0.06)] p-4 shadow-sm md:grid-cols-2">
              {[
                { label: "İçerik", value: "Bitkisel kompleks, hyaluronik asit" },
                { label: "Cilt tipi", value: "Tüm cilt tipleri" },
                { label: "Hacim", value: "150 ml" },
                { label: "Kullanım", value: "Sabah/akşam temiz cilde uygulayın" },
              ].map((row) => (
                <div key={row.label} className="space-y-1 rounded-xl bg-white/20 p-3 shadow-inner">
                  <p className="text-xs uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">{row.label}</p>
                  <p className="text-sm text-foreground">{row.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-[rgba(167,68,68,0.05)] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Miktar</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded-full border border-[rgba(59,43,43,0.2)] text-foreground  flex items-center justify-center transition hover:border-terracotta hover:text-terracotta">
                    <BiMinus />
                  </button>
                  <span className="min-w-[2ch] text-center text-sm font-semibold text-foreground">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="h-9 w-9 rounded-full border border-[rgba(59,43,43,0.2)] flex items-center justify-center transition hover:border-terracotta hover:text-terracotta">
                    <BiPlus />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <button onClick={handleAdd} className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg ${added ? "bg-[var(--sage)]" : "bg-terracotta"}`}>
                  {added ? "Sepete Eklendi" : "Sepete Ekle"}
                </button>
                <button className="w-full rounded-full border border-terracotta px-5 py-3 text-sm font-semibold text-terracotta transition hover:bg-terracotta/10">
                  Hemen Satın Al
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Benzer Ürünler</p>
              <h3 className="heading-font text-2xl text-foreground">Sana da iyi gelebilir</h3>
            </div>
            <Link href="/magaza" className="text-sm text-terracotta hover:underline">
              Tüm ürünler →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/magaza/${item.id}`}
                  className="group overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-md transition hover:shadow-xl"
                >
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 px-4 py-3">
                    <p className="heading-font text-base text-foreground">{item.title}</p>
                    <p className="text-sm font-semibold text-terracotta">{item.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
