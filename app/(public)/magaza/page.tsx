import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stagger from "@/components/Stagger";
import { products } from "./data";

const categories = [
  { id: "all", label: "Tümü" },
  { id: "bakim", label: "Bakım" },
  { id: "temizlik", label: "Temizlik" },
  { id: "serum", label: "Serum" },
];

type Props = {
  searchParams?: Promise<{ kategori?: string }>;
};

export default async function Magaza({ searchParams }: Props) {
  const resolved = (await searchParams) ?? {};
  const active = resolved.kategori ?? "all";
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <main className="relative z-10 space-y-8 bg-[var(--background)] px-6 pb-16 pt-10 text-foreground md:px-10 lg:px-14">
      <Reveal>
        <section className="space-y-3">
          <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Mağaza</p>
          <h1 className="heading-font text-4xl text-foreground">Ürün Kataloğu</h1>
          <p className="text-[rgba(59,43,43,0.75)]">Cildiniz için seçilmiş, sade ve temiz formüller.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {categories.map((cat) => {
              const selected = active === cat.id;
              const href = cat.id === "all" ? "/magaza" : `/magaza?kategori=${encodeURIComponent(cat.id)}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`rounded-full px-4 py-2 text-base transition shadow-sm ${
                    selected
                      ? "bg-terracotta text-white shadow-[rgba(167,68,68,0.25)]"
                      : "border border-[rgba(59,43,43,0.2)] bg-white/70 text-foreground hover:border-terracotta hover:text-terracotta"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/magaza/${product.id}`}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-lg transition hover:shadow-2xl"
          >
            <div className="absolute right-4 top-4 rounded-full bg-sand px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
              {product.tag}
            </div>
            <div className="h-56 w-full overflow-hidden">
              <img
                src={product.img}
                alt={product.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2 px-5 py-4">
              <p className="heading-font text-xl text-foreground">{product.title}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-semibold text-terracotta">{product.price}</span>
                <span className="text-sm uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)] group-hover:text-terracotta">
                  Detay
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Stagger>
    </main>
  );
}

