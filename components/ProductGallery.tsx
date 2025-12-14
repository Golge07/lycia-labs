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
          className="h-[420px] w-full object-cover"
        />
        <button
          onClick={() => setFavorite((f) => !f)}
          className="absolute right-3 top-3 rounded-full border border-[rgba(59,43,43,0.12)] bg-white/90 px-3 py-1 text-sm font-semibold text-terracotta shadow-sm transition hover:bg-terracotta hover:text-white"
        >
          {favorite ? "Favoride" : "Favorilere ekle"}
        </button>
      </div>

      <div className="flex gap-3">
        {images.map((img, idx) => (
          <button
            key={`${img}-${idx}`}
            onClick={() => setSelectedImage(idx)}
            className={`h-20 w-24 overflow-hidden rounded-xl border transition ${
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

