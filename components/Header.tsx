"use client";
import Link from "next/link";
import Cart from "./Cart";
import ProfileButton from "./ProfileButton";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { clearCart, removeFromCart, setCartQty } from "@/lib/slices/cart";

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default function Header() {
  const user = useAppSelector((state) => state.user).user;
  const cartItems = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileRendered, setMobileRendered] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const navLinks = useMemo(() => {
    const common = [
      { href: "/", label: "Anasayfa" },
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/magaza", label: "Mağaza" },
      { href: "/iletisim", label: "İletişim" },
    ];
    return user?.role === "OWNER" ? [...common, { href: "/panel", label: "Panel" }] : common;
  }, [user?.role]);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileRendered) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileRendered]);

  useEffect(() => {
    if (!mobileRendered) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (mobileOpen) {
      gsap.killTweensOf([overlay, panel]);
      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(panel, { xPercent: -100 });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.25, ease: "power1.out" });
      gsap.to(panel, { xPercent: 0, duration: 0.55, ease: "power3.out" });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setMobileRendered(false),
    });
    tl.to(panel, { xPercent: -100, duration: 0.45, ease: "power2.inOut" }, 0);
    tl.to(overlay, { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0.08);
  }, [mobileOpen, mobileRendered]);

  const cartSummary = useMemo(() => {
    const count = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    return { count, subtotal };
  }, [cartItems]);

  const mobileMenu = useMemo(() => {
    if (!mobileRendered) return null;
    return (
      <div className="fixed inset-0 z-40 md:hidden">
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="absolute left-0 top-0 h-full w-[320px] max-w-[92vw] border-r border-foreground/10 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
            <p className="heading-font text-lg text-foreground">Menü</p>
            <button
              type="button"
              onClick={closeMobile}
              className="rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Kapat
            </button>
          </div>

          <div className="h-[calc(100%-72px)] overflow-y-auto px-3 py-4">
            <div className="mb-4 grid gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-foreground/85 transition hover:bg-[rgba(230,215,194,0.35)] hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Profil</p>
              {user ? (
                <>
                  <p className="mt-2 font-semibold text-foreground">{user.username}</p>
                  <p className="mt-1 truncate text-sm text-foreground/70">{user.email}</p>
                  <Link
                    href="/profil"
                    onClick={closeMobile}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                  >
                    Profil ve adres
                  </Link>
                </>
              ) : (
                <div className="mt-3 grid gap-2">
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="inline-flex w-full items-center justify-center rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-foreground/10 bg-white/80 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">Sepet</p>
                  <p className="mt-2 text-sm text-foreground/70">
                    {cartSummary.count > 0 ? (
                      <>
                        <span className="font-semibold text-foreground">{cartSummary.count}</span> ürün •{" "}
                        <span className="font-semibold text-terracotta">{formatMoney(cartSummary.subtotal)}</span>
                      </>
                    ) : (
                      "Sepet boş"
                    )}
                  </p>
                </div>
                {cartItems.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => dispatch(clearCart())}
                    className="shrink-0 rounded-full border border-foreground/15 bg-white px-3 py-1 text-xs font-semibold text-foreground/80 transition hover:border-terracotta hover:text-terracotta"
                  >
                    Temizle
                  </button>
                ) : null}
              </div>

              {cartItems.length > 0 ? (
                <>
                  <div className="mt-3 space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="rounded-xl bg-white/70 px-3 py-2">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 truncate text-sm font-semibold text-foreground">{item.title}</p>
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart({ productId: item.productId }))}
                            className="shrink-0 rounded-full border border-foreground/15 bg-white px-3 py-1 text-xs font-semibold text-foreground/80 transition hover:border-terracotta hover:text-terracotta"
                          >
                            Sil
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(setCartQty({ productId: item.productId, qty: Math.max(1, item.qty - 1) }))
                              }
                              className="h-8 w-8 rounded-full border border-foreground/15 bg-white text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                              aria-label="Azalt"
                            >
                              -
                            </button>
                            <span className="min-w-[2ch] text-center text-sm font-semibold text-foreground">{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => dispatch(setCartQty({ productId: item.productId, qty: item.qty + 1 }))}
                              className="h-8 w-8 rounded-full border border-foreground/15 bg-white text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                              aria-label="Arttır"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-terracotta">
                            {formatMoney(item.unitPrice * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/odeme"
                    onClick={closeMobile}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                  >
                    Ödemeye Geç
                  </Link>
                </>
              ) : (
                <Link
                  href="/magaza"
                  onClick={closeMobile}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                >
                  Mağazaya Git
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [cartItems, cartSummary.count, cartSummary.subtotal, mobileRendered, navLinks, user]);

  return (
    <header className="sticky top-0 z-30 border-b border-[rgba(59,43,43,0.12)] bg-background/90 px-6 py-4 backdrop-blur md:px-12 lg:px-20">
      <nav className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo_no_bg.png"
            alt="Lycia Labs"
            className="h-11 w-11 rounded-xl object-contain shadow-sm sm:h-14 sm:w-14"
          />
          <div>
            <p className="heading-font text-lg text-terracotta sm:text-xl">Lycia Labs</p>
            <p className="hidden text-sm text-[rgba(59,43,43,0.7)] sm:block sm:text-base">
              Doğal bakım ve iyileştirici dokunuş
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-base font-medium text-[rgba(59,43,43,0.85)] md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-terracotta">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Menü"
            aria-expanded={mobileOpen}
            onClick={() => {
              if (!mobileRendered) setMobileRendered(true);
              setMobileOpen((v) => !v);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 bg-white/60 text-foreground transition hover:border-terracotta hover:text-terracotta md:hidden"
          >
            {mobileOpen ? <BiX className="text-2xl" /> : <BiMenu className="text-2xl" />}
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <ProfileButton />
            <Cart />
          </div>
        </div>
      </nav>

      {typeof document !== "undefined" && mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}
