"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type EditableProduct = {
  id?: number;
  title: string;
  price: string; // number string (e.g. "780")
  tag: string;
  category: string;
  stock: number;
  description: string;
  images: string[];
  active: boolean;
};

type Props = {
  initial: EditableProduct;
  mode: "create" | "edit";
};

function compactNonEmpty(values: string[]) {
  return values.map((v) => v.trim()).filter(Boolean);
}

function parseMoney(input: string) {
  const cleaned = input.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default function ProductEditor({ initial, mode }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [price, setPrice] = useState(initial.price);
  const [tag, setTag] = useState(initial.tag);
  const [category, setCategory] = useState(initial.category);
  const [stock, setStock] = useState(initial.stock);
  const [description, setDescription] = useState(initial.description);
  const [images, setImages] = useState<string[]>(initial.images);
  const [active, setActive] = useState(initial.active);

  const [newImage, setNewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanedImages = useMemo(() => compactNonEmpty(images), [images]);
  const primary = cleanedImages[0] ?? "/5.png";
  const priceNumber = useMemo(() => parseMoney(price), [price]);

  const status = useMemo(() => {
    if (!active) return "Pasif";
    if (stock <= 0) return "Tükendi";
    if (stock < 20) return "Az stok";
    return "Aktif";
  }, [active, stock]);

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

  const save = async () => {
    setError(null);
    setSaved(false);

    const payload = {
      title,
      description,
      price: priceNumber,
      tag,
      category,
      stock,
      images: cleanedImages,
      active,
    };

    if (!payload.title.trim()) {
      setError("Ürün adı gerekli.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Kaydedilemedi.");
        const id = Number(data?.id);
        setSaved(true);
        if (Number.isFinite(id)) {
          router.replace(`/panel/urunler/${id}`);
          router.refresh();
        }
        return;
      }

      const id = initial.id;
      if (!id) {
        setError("Geçersiz ürün.");
        return;
      }

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Kaydedilemedi.");

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 1200);
    } catch (e: any) {
      setError(e?.message || "Kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white/80 shadow-sm">
          <img src={primary} alt={title || "Ürün görseli"} className="h-[420px] w-full object-cover" />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="heading-font text-base text-foreground">Görseller</p>
            <span className="inline-flex h-fit w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
              {status}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Görsel URL (https://...)"
              className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground placeholder:text-foreground/45 focus:border-terracotta focus:outline-none"
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
              className="rounded-full border border-foreground/20 bg-white/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Bilgisayardan seç
            </button>
            <p className="text-sm text-foreground/65">Seçilen dosyalar otomatik base64 olarak eklenir.</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Kategori</p>
              <p className="mt-1 font-semibold text-foreground">{category ? category.toUpperCase() : "-"}</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Fiyat</p>
              <p className="mt-1 font-semibold text-terracotta">{formatMoney(priceNumber)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {cleanedImages.slice(0, 6).map((src, idx) => (
              <div
                key={`${src}-${idx}`}
                className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-white/70 shadow-sm"
              >
                <img src={src} alt={`${title || "Görsel"} ${idx + 1}`} className="h-28 w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-10 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  <button type="button" onClick={() => promoteImage(idx)} className="hover:underline">
                    Kapak yap
                  </button>
                  <button type="button" onClick={() => removeImage(idx)} className="hover:underline">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cleanedImages.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-foreground/10 bg-white/70 p-4 text-sm text-foreground/70">
              Henüz görsel eklenmedi.
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="heading-font text-lg text-foreground">Düzenle</p>
            <p className="text-sm text-foreground/65">Alanları güncelle ve kaydet.</p>
          </div>
          <span className="inline-flex h-fit w-fit rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground">
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
                className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Fiyat</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Etiket</label>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Stok</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
              >
                <option value="bakim">Bakım</option>
                <option value="temizlik">Temizlik</option>
                <option value="serum">Serum</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Yayında</label>
              <div className="flex h-[46px] items-center gap-2 rounded-xl border border-foreground/20 bg-white/90 px-4">
                <input
                  id="active"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 accent-terracotta"
                />
                <label htmlFor="active" className="text-sm font-semibold text-foreground">
                  Aktif
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Açıklama</label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-foreground/20 bg-white/90 px-4 py-3 text-sm text-foreground focus:border-terracotta focus:outline-none"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className={`rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-70 ${
                saved ? "bg-[var(--sage)]" : "bg-terracotta"
              }`}
            >
              {saving ? "Kaydediliyor…" : saved ? "Kaydedildi" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
