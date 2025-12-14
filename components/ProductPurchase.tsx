"use client";

import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useAppDispatch } from "@/lib/store";
import { addToCart } from "@/lib/slices/cart";

type Props = {
  productId: number;
  title: string;
  price: string;
  img: string;
};

function parsePrice(input: string) {
  const cleaned = input.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

export default function ProductPurchase({ productId, title, price, img }: Props) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId,
        title,
        img,
        unitPrice: parsePrice(price),
        qty: quantity,
      }),
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-[rgba(167,68,68,0.05)] p-4 shadow-sm">
      <p className="text-2xl font-semibold text-terracotta">{price}</p>

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-foreground">Miktar</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(59,43,43,0.2)] text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            <BiMinus />
          </button>
          <span className="min-w-[2ch] text-center text-base font-semibold text-foreground">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(59,43,43,0.2)] transition hover:border-terracotta hover:text-terracotta"
          >
            <BiPlus />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          onClick={handleAdd}
          className={`w-full rounded-full px-5 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg ${
            added ? "bg-[var(--sage)]" : "bg-terracotta"
          }`}
        >
          {added ? "Sepete eklendi" : "Sepete ekle"}
        </button>
        <button className="w-full rounded-full border border-terracotta px-5 py-3 text-base font-semibold text-terracotta transition hover:bg-terracotta/10">
          Hemen satın al
        </button>
      </div>
    </div>
  );
}
