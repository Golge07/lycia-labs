import Link from "next/link";
import ProductEditor from "@/components/admin/ProductEditor";

export default function PanelYeniUrun() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Yeni Ürün</p>
          <p className="mt-1 text-sm text-[rgba(59,43,43,0.65)]">Demo: alanlar düzenlenebilir, kaydetme aktif değil.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/panel/urunler"
            className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Ürünlere Dön
          </Link>
        </div>
      </div>

      <ProductEditor
        initial={{
          title: "Yeni ürün",
          price: "₺0",
          tag: "Yeni",
          category: "bakim",
          stock: 0,
          description: "",
          images: ["/5.png"],
        }}
      />
    </div>
  );
}

