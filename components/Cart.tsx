"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import Button from "./ui/button";

export default function Cart() {
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
          className="absolute right-0 top-0 h-full w-[380px] max-w-[92vw] border-l border-[rgba(59,43,43,0.12)] bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-center justify-between border-b border-[rgba(59,43,43,0.12)] px-5 py-4">
            <div>
              <p className="heading-font text-lg text-foreground">Sepet</p>
              <p className="text-sm text-[rgba(59,43,43,0.65)]">Seçtiklerin burada birikir.</p>
            </div>
            <button
              onClick={close}
              className="rounded-full border border-[rgba(59,43,43,0.14)] bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Kapat
            </button>
          </div>

          <div className="space-y-4 px-5 py-5 text-[rgba(59,43,43,0.75)]">
            <div className="rounded-2xl border border-[rgba(59,43,43,0.12)] bg-[rgba(230,215,194,0.28)] p-4 shadow-sm">
              <p className="heading-font text-base text-foreground">Sepet henüz boş</p>
              <p className="mt-1 text-sm">Mağazaya göz atıp favorilerini ekleyebilirsin.</p>
              <Link
                href="/magaza"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-5 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg"
              >
                Mağazaya Git
              </Link>
            </div>

            <div className="rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="heading-font text-sm text-foreground">Örnek ürün</p>
                  <p className="text-sm text-[rgba(59,43,43,0.65)]">Bu alan demo amaçlıdır.</p>
                </div>
                <p className="text-base font-semibold text-terracotta">₺520</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [rendered]);

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
        <FaShoppingBag />
      </Button>

      {typeof document !== "undefined" && ui ? createPortal(ui, document.body) : null}
    </>
  );
}
