"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setUser } from "@/lib/slices/auth";

type ProfileForm = {
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
};

export default function ProfilGenel() {
  const reduxUser = useAppSelector((s) => s.user.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    username: reduxUser?.username ?? "",
    first_name: (reduxUser as any)?.first_name ?? "",
    last_name: (reduxUser as any)?.last_name ?? "",
    phone: (reduxUser as any)?.phone ?? "",
  });

  const canShow = useMemo(() => !!reduxUser, [reduxUser]);

  useEffect(() => {
    if (!reduxUser) return;
    setForm({
      username: reduxUser.username ?? "",
      first_name: (reduxUser as any)?.first_name ?? "",
      last_name: (reduxUser as any)?.last_name ?? "",
      phone: (reduxUser as any)?.phone ?? "",
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
        <p className="mt-1 text-sm text-foreground/80">Profil işlemleri için giriş yapman gerekiyor.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/login"
            className="rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-foreground/20 bg-white/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    );
  }

  const update = (key: keyof ProfileForm, value: string) => {
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
        body: JSON.stringify({
          username: form.username,
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
        }),
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
    <div className="rounded-3xl border border-foreground/10 bg-white/70 p-5 shadow-xl sm:p-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="heading-font text-2xl text-foreground">Genel</p>
          <p className="mt-1 text-sm text-foreground/65">Hesap bilgileri</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={`w-full rounded-full px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-70 sm:w-auto ${
            saved ? "bg-[var(--sage)]" : "bg-terracotta"
          }`}
        >
          {saving ? "Kaydediliyor…" : saved ? "Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {loading ? <p className="mt-3 text-sm text-foreground/65">Yükleniyor…</p> : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Kullanıcı adı</label>
          <input
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Telefon</label>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
            placeholder="+90 5xx xxx xx xx"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

      {error ? (
        <div className="mt-4 rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-foreground/10 bg-white/70 p-4">
        <p className="heading-font text-base text-foreground">E-posta</p>
        <p className="mt-1 text-sm text-foreground/70">{reduxUser?.email}</p>
      </div>
    </div>
  );
}
