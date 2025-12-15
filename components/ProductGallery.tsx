"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  title: string;
  images: string[];
};

export default function ProductGallery({ title, images }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const element = imageRef.current;
    if (!element) return;
    gsap.fromTo(element, { autoAlpha: 0.6, scale: 1.01 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out" });
  }, [selectedImage]);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <img
          ref={imageRef}
          src={images[selectedImage] || "/5.png"}
          alt={title}
          className="h-[320px] w-full object-cover sm:h-[420px]"
        />
        <button
          onClick={() => setFavorite((f) => !f)}
          className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] truncate whitespace-nowrap rounded-full border border-[rgba(59,43,43,0.12)] bg-white/90 px-3 py-1 text-xs font-semibold text-terracotta shadow-sm transition hover:bg-terracotta hover:text-white sm:text-sm"
        >
          {favorite ? "Favoride" : "Favorilere ekle"}
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            onClick={() => setSelectedImage(idx)}
            className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border transition sm:h-20 sm:w-24 ${
              selectedImage === idx
                ? "border-terracotta shadow-md"
                : "border-[rgba(59,43,43,0.12)] hover:border-terracotta/60"
            }`}
          >
            <img src={img || "/5.png"} alt={`${title} ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
