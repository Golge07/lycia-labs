import Link from "next/link";
import { products } from "../../../(public)/magaza/data";
import { statusFromStock, stockByProductId } from "./data";

export default function PanelUrunler() {
  return (
    <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Ürün Yönetimi</p>
          <p className="mt-1 text-sm text-[rgba(59,43,43,0.65)]">Ürün detayı, stok ve içerik düzenleme (demo)</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta">
            İçe Aktar
          </button>
          <Link
            href="/panel/urunler/yeni"
            className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Yeni Ürün
          </Link>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80">
        <div className="grid grid-cols-[0.7fr_1.6fr_0.7fr_0.6fr_0.7fr] gap-3 border-b border-[rgba(59,43,43,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">
          <span>ID</span>
          <span>Ürün</span>
          <span>Fiyat</span>
          <span>Stok</span>
          <span>Durum</span>
        </div>
        <div className="divide-y divide-[rgba(59,43,43,0.12)]">
          {products.map((p) => {
            const stock = stockByProductId[p.id] ?? 0;
            const status = statusFromStock(stock);
            return (
              <Link
                key={p.id}
                href={`/panel/urunler/${p.id}`}
                className="grid grid-cols-[0.7fr_1.6fr_0.7fr_0.6fr_0.7fr] gap-3 px-4 py-3 text-sm text-[rgba(59,43,43,0.8)] transition hover:bg-[rgba(230,215,194,0.25)]"
              >
                <p className="font-semibold text-foreground">{p.id}</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-[rgba(59,43,43,0.12)] bg-white/70">
                    <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-[rgba(59,43,43,0.6)]">{p.tag}</p>
                  </div>
                </div>
                <p className="font-semibold text-terracotta">{p.price}</p>
                <p className="font-semibold text-foreground">{stock}</p>
                <span className="inline-flex h-fit w-fit rounded-full bg-[rgba(59,43,43,0.06)] px-3 py-1 text-xs font-semibold text-foreground">
                  {status}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
