"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { FaUser } from "react-icons/fa6";
import Button from "./ui/button";

export default function ProfileButton() {
  const [rendered, setRendered] = useState(false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const button = triggerRef.current;
    if (!button) return;

    const update = () => {
      const rect = button.getBoundingClientRect();
      const right = Math.max(12, window.innerWidth - rect.right);
      const top = rect.bottom + 10;
      setPos({ top, right });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open) return;

    const handler = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const panel = panelRef.current;
      const trigger = triggerRef.current;

      if (panel?.contains(target)) return;
      if (trigger?.contains(target)) return;
      close();
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [close, open]);

  useEffect(() => {
    const panel = innerRef.current;
    if (!panel) return;
    if (!rendered) return;

    gsap.killTweensOf(panel);

    if (open) {
      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: -10, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: "power2.out" },
      );
      return;
    }

    gsap.to(panel, {
      autoAlpha: 0,
      y: -8,
      scale: 0.985,
      duration: 0.18,
      ease: "power1.in",
      onComplete: () => setRendered(false),
    });
  }, [open, rendered]);

  const ui = useMemo(() => {
    if (!rendered) return null;

    return (
      <div
        ref={panelRef}
        className="fixed z-50"
        style={{ top: pos.top, right: pos.right }}
        role="dialog"
        aria-label="Profil menüsü"
      >
        <div
          ref={innerRef}
          className="w-72 origin-top-right overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/95 shadow-[0_18px_50px_rgba(0,0,0,0.14)]"
        >
          <div className="border-b border-[rgba(59,43,43,0.12)] px-4 py-3">
            <p className="heading-font text-base text-foreground">Profil</p>
            <p className="text-sm text-[rgba(59,43,43,0.65)]">Hızlı işlemler</p>
          </div>

          <div className="p-2">
            {[
              { label: "Giriş yap / Kayıt ol", href: "#" },
              { label: "Favorilerim", href: "#" },
              { label: "Siparişlerim", href: "#" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={close}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[rgba(230,215,194,0.35)]"
              >
                <span>{item.label}</span>
                <span className="text-terracotta">→</span>
              </a>
            ))}
          </div>

          <div className="p-3 pt-1">
            <button
              onClick={close}
              className="w-full rounded-xl border border-[rgba(59,43,43,0.14)] bg-white px-3 py-2 text-sm font-semibold text-terracotta transition hover:bg-terracotta/10"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  }, [close, panelRef, pos.right, pos.top, rendered]);

  return (
    <>
      <Button
        outline
        aria-label="Profil"
        className="h-10 w-10 p-0 text-terracotta hover:bg-terracotta hover:text-white"
        onClick={() => {
          if (open) {
            close();
            return;
          }
          setRendered(true);
          setOpen(true);
        }}
        ref={triggerRef}
      >
        <FaUser />
      </Button>

      {typeof document !== "undefined" && ui ? createPortal(ui, document.body) : null}
    </>
  );
}
