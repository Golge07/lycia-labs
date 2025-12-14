"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setUser } from "@/lib/slices/auth";

type AddressForm = {
  phone: string;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  postal_code: string;
  country: string;
};

export default function ProfilAdres() {
  const reduxUser = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AddressForm>({
    phone: (reduxUser as any)?.phone ?? "",
    first_name: (reduxUser as any)?.first_name ?? "",
    last_name: (reduxUser as any)?.last_name ?? "",
    address_line1: (reduxUser as any)?.address_line1 ?? "",
    address_line2: (reduxUser as any)?.address_line2 ?? "",
    city: (reduxUser as any)?.city ?? "",
    district: (reduxUser as any)?.district ?? "",
    postal_code: (reduxUser as any)?.postal_code ?? "",
    country: (reduxUser as any)?.country ?? "TR",
  });

  const canShow = useMemo(() => !!reduxUser, [reduxUser]);

  useEffect(() => {
    if (!reduxUser) return;
    setForm({
      phone: (reduxUser as any)?.phone ?? "",
      first_name: (reduxUser as any)?.first_name ?? "",
      last_name: (reduxUser as any)?.last_name ?? "",
      address_line1: (reduxUser as any)?.address_line1 ?? "",
      address_line2: (reduxUser as any)?.address_line2 ?? "",
      city: (reduxUser as any)?.city ?? "",
      district: (reduxUser as any)?.district ?? "",
      postal_code: (reduxUser as any)?.postal_code ?? "",
      country: (reduxUser as any)?.country ?? "TR",
    });
  }, [reduxUser]);

  useEffect(() => {
    if (!reduxUser?.id) return;
    setLoading(true);
    fetch("/api/profile", { method: "GET" })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        dispatch(setUser(data as any));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dispatch, reduxUser?.id]);

  if (!canShow) {
    return (
      <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 shadow-sm">
        <p className="heading-font text-lg text-foreground">Giriş gerekli</p>
        <p className="mt-1 text-sm text-foreground/80">Adres düzenlemek için giriş yapman gerekiyor.</p>
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

  const update = (key: keyof AddressForm, value: string) => {
    setSaved(false);
    setError(null);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Kaydedilemedi.");
        return;
      }
      dispatch(setUser(data as any));
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Adres</p>
          <p className="mt-1 text-sm text-foreground/65">Teslimat bilgileri</p>
        </div>
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

      {loading ? <p className="mt-3 text-sm text-foreground/65">Yükleniyor…</p> : null}

      <div className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Ad</label>
            <input
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Soyad</label>
            <input
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Telefon</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
              placeholder="+90 5xx xxx xx xx"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Posta kodu</label>
            <input
              value={form.postal_code}
              onChange={(e) => update("postal_code", e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
              placeholder="34000"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">İl</label>
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
              placeholder="İstanbul"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">İlçe</label>
            <input
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
              className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
              placeholder="Beşiktaş"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Adres satırı</label>
          <textarea
            rows={3}
            value={form.address_line1}
            onChange={(e) => update("address_line1", e.target.value)}
            className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
            placeholder="Mahalle, sokak, bina no..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Adres satırı 2 (opsiyonel)</label>
          <input
            value={form.address_line2}
            onChange={(e) => update("address_line2", e.target.value)}
            className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
            placeholder="Daire, kat vb."
          />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
          {error}
        </div>
      ) : null}
    </div>
  );
}
