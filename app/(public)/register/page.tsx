"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Kayıt oluşturulamadı.");
        return;
      }

      router.refresh();
      router.push("/login");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] bg-background px-6 py-12 text-foreground md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-6 shadow-2xl backdrop-blur">
          <div className="space-y-2">
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Hesap</p>
            <h1 className="heading-font text-3xl text-foreground">Kayıt Ol</h1>
            <p className="text-sm text-[rgba(59,43,43,0.65)]">Hızlıca hesap oluştur ve devam et.</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Kullanıcı adı</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Örn. eren"
                className="w-full rounded-2xl border border-[rgba(59,43,43,0.16)] bg-white/90 px-4 py-3 text-base text-foreground placeholder:text-[rgba(59,43,43,0.45)] focus:border-terracotta focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="mail@ornek.com"
                className="w-full rounded-2xl border border-[rgba(59,43,43,0.16)] bg-white/90 px-4 py-3 text-base text-foreground placeholder:text-[rgba(59,43,43,0.45)] focus:border-terracotta focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Şifre</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[rgba(59,43,43,0.16)] bg-white/90 px-4 py-3 text-base text-foreground placeholder:text-[rgba(59,43,43,0.45)] focus:border-terracotta focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Şifre tekrar</label>
                <input
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[rgba(59,43,43,0.16)] bg-white/90 px-4 py-3 text-base text-foreground placeholder:text-[rgba(59,43,43,0.45)] focus:border-terracotta focus:outline-none"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[rgba(167,68,68,0.25)] transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
              Kayıt Ol
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-[rgba(59,43,43,0.7)]">
            <p>Zaten hesabın var mı?</p>
            <Link href="/login" className="font-semibold text-terracotta hover:underline">
              Giriş yap
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

