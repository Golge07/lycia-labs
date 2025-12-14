"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { clearCart, removeFromCart, setCartQty } from "@/lib/slices/cart";

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default function Cart() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [rendered, setRendered] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!rendered) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [rendered]);

  useEffect(() => {
    if (!rendered) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (open) {
      gsap.killTweensOf([overlay, panel]);
      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(panel, { xPercent: 100 });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.25, ease: "power1.out" });
      gsap.to(panel, { xPercent: 0, duration: 0.55, ease: "power3.out" });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setRendered(false),
    });

    tl.to(panel, { xPercent: 100, duration: 0.45, ease: "power2.inOut" }, 0);
    tl.to(overlay, { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0.08);
  }, [open, rendered]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    return { subtotal, count };
  }, [items]);

  const ui = useMemo(() => {
    if (!rendered) return null;

    return (
      <div className="fixed inset-0 z-50">
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={close}
          aria-hidden
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Sepet"
          className="absolute right-0 top-0 h-full w-[380px] max-w-[92vw] border-l border-foreground/10 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
            <div>
              <p className="heading-font text-lg text-foreground">Sepet</p>
              <p className="text-sm text-foreground/65">Seçtiklerin burada birikir.</p>
            </div>
            <button
              onClick={close}
              className="rounded-full border border-foreground/15 bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Kapat
            </button>
          </div>

          <div className="flex h-[calc(100%-72px)] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-foreground/80">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-foreground/10 bg-[rgba(230,215,194,0.28)] p-4 shadow-sm">
                  <p className="heading-font text-base text-foreground">Sepet henüz boş</p>
                  <p className="mt-1 text-sm">Mağazaya göz atıp ürün ekleyebilirsin.</p>
                  <Link
                    href="/magaza"
                    onClick={close}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-5 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg"
                  >
                    Mağazaya Git
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white/80 px-4 py-3 text-sm shadow-sm">
                    <p>
                      Toplam <span className="font-semibold text-foreground">{totals.count}</span> ürün
                    </p>
                    <button
                      onClick={() => dispatch(clearCart())}
                      className="font-semibold text-terracotta transition hover:underline"
                    >
                      Temizle
                    </button>
                  </div>

                  {items.map((item) => (
                    <div key={item.productId} className="rounded-2xl border border-foreground/10 bg-white/85 p-4 shadow-sm">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 overflow-hidden rounded-xl border border-foreground/10 bg-white/70">
                          <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-foreground">{item.title}</p>
                          <p className="mt-1 text-sm text-foreground/65">
                            {formatMoney(item.unitPrice)} • ID: {item.productId}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart({ productId: item.productId }))}
                          className="h-fit rounded-full border border-foreground/15 bg-white px-3 py-1 text-xs font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
                        >
                          Sil
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              dispatch(setCartQty({ productId: item.productId, qty: Math.max(1, item.qty - 1) }))
                            }
                            className="h-9 w-9 rounded-full border border-foreground/20 bg-white text-foreground transition hover:border-terracotta hover:text-terracotta"
                            aria-label="Azalt"
                          >
                            -
                          </button>
                          <span className="min-w-[2ch] text-center text-sm font-semibold text-foreground">{item.qty}</span>
                          <button
                            onClick={() => dispatch(setCartQty({ productId: item.productId, qty: item.qty + 1 }))}
                            className="h-9 w-9 rounded-full border border-foreground/20 bg-white text-foreground transition hover:border-terracotta hover:text-terracotta"
                            aria-label="Arttır"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-terracotta">{formatMoney(item.unitPrice * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="border-t border-foreground/10 bg-white/90 px-5 py-4">
              <div className="flex items-center justify-between text-sm text-foreground/80">
                <span>Ara toplam</span>
                <span className="font-semibold text-foreground">{formatMoney(totals.subtotal)}</span>
              </div>
              <button
                disabled={items.length === 0}
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-5 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  if (items.length === 0) return;
                  close();
                  router.push("/odeme");
                }}
              >
                Ödemeye Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [dispatch, items, rendered, router, totals.count, totals.subtotal]);

  return (
    <>
      <Button
        onClick={() => {
          setRendered(true);
          setOpen(true);
        }}
        outline
        aria-label="Sepet"
        className="h-10 w-10 p-0"
      >
        <span className="relative">
          <FaShoppingBag />
          {totals.count > 0 ? (
            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-semibold text-white shadow">
              {totals.count > 99 ? "99+" : totals.count}
            </span>
          ) : null}
        </span>
      </Button>

      {typeof document !== "undefined" && ui ? createPortal(ui, document.body) : null}
    </>
  );
}
