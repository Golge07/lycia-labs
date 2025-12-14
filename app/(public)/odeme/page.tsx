"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { clearCart } from "@/lib/slices/cart";

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default function OdemePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.user);
  const items = useAppSelector((s) => s.cart.items);

  const addressMissing = useMemo(() => {
    if (!user) return false;
    const required = [user.first_name, user.last_name, user.phone, user.address_line1, user.city, user.district];
    return required.some((v) => !v || !String(v).trim());
  }, [user]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 49;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  const [note, setNote] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !user || items.length === 0 || submitting || addressMissing;

  const createOrder = async () => {
    if (disabled) return;
    if (addressMissing) {
      setError("Adres bilgilerin eksik. Sipariş vermek için önce adresini tamamla.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, note }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || "Sipariş oluşturulamadı.");
        return;
      }

      const orderId = data?.order?.id;
      dispatch(clearCart());
      router.push(orderId ? `/profil/siparisler/${encodeURIComponent(orderId)}` : "/profil/siparisler");
    } catch {
      setError("Bir hata oluştu. Tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-background px-6 pb-16 pt-10 text-foreground md:px-12 lg:px-20">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Ödeme</p>
            <h1 className="heading-font text-3xl text-foreground">Siparişi Tamamla</h1>
            <p className="mt-1 text-sm text-foreground/65">Kart alanları demo; sipariş DB’ye yazılır.</p>
          </div>
          <Link
            href="/magaza"
            className="rounded-full border border-foreground/20 bg-white/60 px-5 py-2 text-base font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Mağazaya Dön
          </Link>
        </div>

        {!user ? (
          <div className="rounded-3xl border border-terracotta/20 bg-terracotta/10 p-6 shadow-sm">
            <p className="heading-font text-lg text-foreground">Devam etmek için giriş yap</p>
            <p className="mt-1 text-sm text-foreground/80">
              Ödeme adımını tamamlamak için hesabınla giriş yapman gerekiyor.
            </p>
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
        ) : null}

        {items.length === 0 ? (
          <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
            <p className="heading-font text-lg text-foreground">Sepet boş</p>
            <p className="mt-1 text-sm text-foreground/65">Ödeme için önce sepete ürün ekle.</p>
            <Link
              href="/magaza"
              className="mt-4 inline-flex rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              Ürünleri Gör
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <section className="space-y-6">
              <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
                <p className="heading-font text-lg text-foreground">Profil</p>
                <p className="mt-1 text-sm text-foreground/65">Fatura ve teslimat için</p>
                {user ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Kullanıcı</p>
                      <p className="mt-1 font-semibold text-foreground">{user.username}</p>
                    </div>
                    <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">E-posta</p>
                      <p className="mt-1 truncate font-semibold text-foreground">{user.email}</p>
                    </div>
                  </div>
                ) : null}
                {user && addressMissing ? (
                  <div className="mt-4 rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
                    <p className="font-semibold">Adres bilgilerin eksik</p>
                    <p className="mt-1 text-foreground/80">Sipariş verebilmek için önce teslimat adresini tamamlamalısın.</p>
                    <Link href="/profil/adres" className="mt-2 inline-flex font-semibold text-terracotta hover:underline">
                      Adresini tamamla →
                    </Link>
                  </div>
                ) : null}
                <Link href="/profil" className="mt-4 inline-flex text-sm font-semibold text-terracotta hover:underline">
                  Profil ve adresleri düzenle →
                </Link>
              </div>

              <div className="rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl">
                <p className="heading-font text-lg text-foreground">Ödeme</p>
                <p className="mt-1 text-sm text-foreground/65">Kart bilgileri demo amaçlıdır.</p>

                <div className="mt-5 grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Kart üzerindeki isim</label>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
                      placeholder="Örn. Ayşe Yılmaz"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Kart numarası</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Son kullanma</label>
                      <input
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        inputMode="numeric"
                        className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
                        placeholder="AA/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">CVV</label>
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        inputMode="numeric"
                        className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Not (opsiyonel)</label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full rounded-2xl border border-foreground/20 bg-white/90 px-4 py-3 text-base text-foreground focus:border-terracotta focus:outline-none"
                      placeholder="Teslimat notu vb."
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-terracotta/20 bg-terracotta/10 px-4 py-3 text-sm text-foreground">
                      {error}
                    </div>
                  ) : null}

                  <button
                    disabled={disabled}
                    className="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[rgba(167,68,68,0.25)] transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={createOrder}
                  >
                    {submitting ? "Sipariş oluşturuluyor…" : "Siparişi Oluştur"}
                  </button>
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-xl lg:sticky lg:top-24">
              <p className="heading-font text-lg text-foreground">Sipariş Özeti</p>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3 shadow-sm">
                    <div className="h-14 w-14 overflow-hidden rounded-xl border border-foreground/10 bg-white/70">
                      <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-foreground/65">
                        {item.qty} × {formatMoney(item.unitPrice)}
                      </p>
                    </div>
                    <p className="font-semibold text-terracotta">{formatMoney(item.unitPrice * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2 text-sm text-foreground/80">
                <div className="flex items-center justify-between">
                  <span>Ara toplam</span>
                  <span className="font-semibold text-foreground">{formatMoney(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kargo</span>
                  <span className="font-semibold text-foreground">{formatMoney(totals.shipping)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-foreground/10 pt-2">
                  <span className="font-semibold text-foreground">Toplam</span>
                  <span className="font-semibold text-terracotta">{formatMoney(totals.total)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
