"use client";

import { setUser } from "@/lib/slices/auth";
import { useAppDispatch } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Giriş yapılamadı.");
        return;
      }

      if (data?.user) dispatch(setUser(data.user));
      router.push(data?.user?.role === "OWNER" ? "/panel" : "/");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] bg-background px-6 py-12 text-foreground md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-foreground/10 bg-white/80 p-6 shadow-2xl backdrop-blur">
          <div className="space-y-2">
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Hesap</p>
            <h1 className="heading-font text-3xl text-foreground">Giriş Yap</h1>
            <p className="text-sm text-foreground/65">Yönetim ekranına erişmek için giriş yap.</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">E-posta</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="mail@ornek.com"
                className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground placeholder:text-foreground/45 focus:border-terracotta focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Şifre</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground placeholder:text-foreground/45 focus:border-terracotta focus:outline-none"
              />
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
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-foreground/70">
            <p>Hesabın yok mu?</p>
            <Link href="/register" className="font-semibold text-terracotta hover:underline">
              Kayıt ol
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
