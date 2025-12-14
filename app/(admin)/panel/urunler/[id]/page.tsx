import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "../../../../(public)/magaza/data";
import { statusFromStock, stockByProductId } from "../data";
import ProductEditor from "@/components/admin/ProductEditor";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PanelUrunDetay({ params }: Props) {
  const resolved = await params;
  const id = Number(resolved.id);
  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  const stock = stockByProductId[product.id] ?? 0;
  const status = statusFromStock(stock);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Ürün Detayı</p>
          <p className="mt-1 text-sm text-[rgba(59,43,43,0.65)]">
            ID: {product.id} • Durum: <span className="font-semibold text-foreground">{status}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/panel/urunler"
            className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Ürünlere Dön
          </Link>
          <Link
            href={`/magaza/${product.id}`}
            className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Mağazada Gör
          </Link>
        </div>
      </div>

      <ProductEditor
        initial={{
          id: product.id,
          title: product.title,
          price: product.price,
          tag: product.tag,
          category: product.category,
          stock,
          description: product.description ?? "",
          images: [product.img],
        }}
      />
    </div>
  );
}
