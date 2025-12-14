"use client";

import { useMemo, useRef, useState } from "react";

export type EditableProduct = {
  id?: number;
  title: string;
  price: string;
  tag: string;
  category: string;
  stock: number;
  description: string;
  images: string[];
};

function compactNonEmpty(values: string[]) {
  return values.map((v) => v.trim()).filter(Boolean);
}

export default function ProductEditor({ initial }: { initial: EditableProduct }) {
  const [title, setTitle] = useState(initial.title);
  const [price, setPrice] = useState(initial.price);
  const [tag, setTag] = useState(initial.tag);
  const [category, setCategory] = useState(initial.category);
  const [stock, setStock] = useState(initial.stock);
  const [description, setDescription] = useState(initial.description);
  const [images, setImages] = useState<string[]>(initial.images);
  const [newImage, setNewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const cleanedImages = useMemo(() => compactNonEmpty(images), [images]);
  const primary = cleanedImages[0] ?? "/5.png";

  const addImage = () => {
    const url = newImage.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setNewImage("");
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === "string" ? reader.result : "";
        if (!value) return;
        setImages((prev) => [...prev, value]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const promoteImage = (index: number) => {
    setImages((prev) => {
      const list = [...prev];
      const [picked] = list.splice(index, 1);
      list.unshift(picked);
      return list;
    });
  };

  const status = stock <= 0 ? "Tükendi" : stock < 20 ? "Az Stok" : "Aktif";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
        <div className="overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-sm">
          <img src={primary} alt={title || "Ürün görseli"} className="h-[420px] w-full object-cover" />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="heading-font text-base text-foreground">Görseller</p>
            <span className="inline-flex h-fit w-fit rounded-full bg-[rgba(59,43,43,0.06)] px-3 py-1 text-xs font-semibold text-foreground">
              {status}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Görsel URL (https://...)"
              className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground placeholder:text-[rgba(59,43,43,0.45)] focus:border-terracotta focus:outline-none"
            />
            <button
              type="button"
              onClick={addImage}
              className="shrink-0 rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              Ekle
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.currentTarget.files);
                e.currentTarget.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-[rgba(59,43,43,0.18)] bg-white/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Bilgisayardan seç
            </button>
            <p className="text-sm text-[rgba(59,43,43,0.65)]">
              Seçilen dosyalar otomatik base64 olarak eklenir.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">Kategori</p>
              <p className="mt-1 font-semibold text-foreground">{category ? category.toUpperCase() : "-"}</p>
            </div>
            <div className="rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">Stok</p>
              <p className="mt-1 font-semibold text-foreground">{stock}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {cleanedImages.length ? (
              cleanedImages.map((src, idx) => (
                <div
                  key={`${src}-${idx}`}
                  className="group overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-sm"
                >
                  <div className="relative h-24 w-full overflow-hidden">
                    <img src={src} alt={`${title || "Görsel"} ${idx + 1}`} className="h-full w-full object-cover" />
                    {idx === 0 ? (
                      <span className="absolute left-2 top-2 rounded-full bg-terracotta px-2 py-1 text-[10px] font-semibold text-white">
                        Kapak
                      </span>
                    ) : null}
                  </div>
                  <div className="flex gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => promoteImage(idx)}
                      className="flex-1 rounded-xl border border-[rgba(59,43,43,0.16)] bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                      title="Kapak yap"
                    >
                      Kapak
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="flex-1 rounded-xl border border-[rgba(59,43,43,0.16)] bg-white px-3 py-2 text-xs font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                      title="Kaldır"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-4 text-sm text-[rgba(59,43,43,0.7)] shadow-sm sm:col-span-3">
                Henüz görsel eklenmedi.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="heading-font text-lg text-foreground">Düzenle</p>
            <p className="text-sm text-[rgba(59,43,43,0.65)]">Demo: alanlar düzenlenebilir, kaydetme aktif değil.</p>
          </div>
          <span className="inline-flex h-fit w-fit rounded-full bg-[rgba(59,43,43,0.06)] px-3 py-1 text-xs font-semibold text-foreground">
            {status}
          </span>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Ürün adı</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Fiyat</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Etiket</label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Stok</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              >
                <option value="bakim">Bakım</option>
                <option value="temizlik">Temizlik</option>
                <option value="serum">Serum</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Kapak görseli</label>
              <input
                value={primary}
                readOnly
                className="w-full rounded-xl border border-[rgba(59,43,43,0.14)] bg-white/60 px-4 py-3 text-sm text-[rgba(59,43,43,0.7)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Açıklama</label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled
              className="rounded-full bg-terracotta/50 px-5 py-3 text-sm font-semibold text-white shadow-md"
              title="Demo panel: kaydetme kapalı"
            >
              Kaydet
            </button>
            <button
              type="button"
              className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Taslak Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
