"use client";

import Link from "next/link";
import { useState } from "react";
import { FaShoppingBag, FaUser } from "react-icons/fa";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/magaza", label: "Mağaza" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const [openCart, setOpenCart] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(59,43,43,0.12)] bg-background/90 px-6 py-4 backdrop-blur md:px-12 lg:px-20">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/1.png" alt="Lycia Labs" className="h-14 w-14 rounded-xl object-contain shadow-sm" />
          <div>
            <p className="heading-font text-xl text-terracotta">Lycia Labs</p>
            <p className="text-sm text-[rgba(59,43,43,0.7)]">Doğal bakım ve iyileştirici dokunuş</p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-[rgba(59,43,43,0.85)] md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-terracotta">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenProfile((p) => !p)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(59,43,43,0.15)] text-terracotta transition hover:border-terracotta hover:bg-terracotta hover:text-white"
            aria-label="Profil"
          >
            <FaUser />
          </button>
          <button
            onClick={() => setOpenCart(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(59,43,43,0.15)] text-terracotta transition hover:border-terracotta hover:bg-terracotta hover:text-white"
            aria-label="Sepet"
          >
            <FaShoppingBag />
          </button>
        </div>
      </nav>

      {openProfile && (
        <div className="absolute right-6 top-16 z-30 w-56 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/90 p-4 shadow-xl md:right-12 lg:right-20">
          <p className="heading-font text-sm text-foreground">Profil</p>
          <div className="mt-3 space-y-2 text-sm text-[rgba(59,43,43,0.75)]">
            <p>Giriş yap / Kayıt ol</p>
            <p>Favorilerim</p>
            <p>Siparişlerim</p>
          </div>
        </div>
      )}

      {openCart && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm"
            onClick={() => setOpenCart(false)}
            aria-hidden
          />
          <div className="fixed right-0 top-0 z-40 h-full w-80 max-w-[80%] bg-white/95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(59,43,43,0.12)] px-4 py-3">
              <p className="heading-font text-lg text-foreground">Sepet</p>
              <button onClick={() => setOpenCart(false)} className="text-sm text-terracotta hover:underline">
                Kapat
              </button>
            </div>
            <div className="space-y-3 px-4 py-4 text-sm text-[rgba(59,43,43,0.7)]">
              <p>Sepet içeriği henüz eklenmedi.</p>
              <div className="rounded-xl border border-[rgba(59,43,43,0.12)] bg-white/90 p-3 shadow-sm">
                <p className="heading-font text-sm text-foreground">Örnek ürün</p>
                <p className="text-terracotta font-semibold">₺520</p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
