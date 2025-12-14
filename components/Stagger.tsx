"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
};

export default function Stagger({
  children,
  className,
  delay = 0,
  y = 14,
  duration = 0.6,
  stagger = 0.08,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.children) as HTMLElement[];
    if (items.length === 0) return;

    gsap.set(items, { autoAlpha: 0, y });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        gsap.to(items, { autoAlpha: 1, y: 0, duration, delay, stagger, ease: "power2.out" });
        if (once) observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [delay, duration, once, stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

