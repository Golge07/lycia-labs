import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stagger from "@/components/Stagger";

const categories = [
  { id: "all", label: "Tümü" },
  { id: "bakim", label: "Bakım" },
  { id: "temizlik", label: "Temizlik" },
  { id: "serum", label: "Serum" },
];

type Props = {
  searchParams?: Promise<{ kategori?: string }>;
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  );
}

export default async function Magaza({ searchParams }: Props) {
  const resolved = (await searchParams) ?? {};
  const active = resolved.kategori ?? "all";

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products${active && active !== "all" ? `?kategori=${encodeURIComponent(active)}` : ""}`, {
    next: { tags: ["products"] },
  });
  if (!res.ok) {
    // Fail-safe: render empty list if API fails.
    return (
      <main className="relative z-10 space-y-8 bg-[var(--background)] px-6 pb-16 pt-10 text-foreground md:px-10 lg:px-14">
        <Reveal>
          <section className="space-y-3">
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Mağaza</p>
            <h1 className="heading-font text-4xl text-foreground">Ürün Kataloğu</h1>
            <p className="text-[rgba(59,43,43,0.75)]">Ürünler şu an yüklenemedi.</p>
          </section>
        </Reveal>
      </main>
    );
  }
  const products = (await res.json().catch(() => [])) as Array<{
    id: number;
    title: string;
    description: string | null;
    price: number;
    tag: string | null;
    category: string | null;
    stock: number;
    images: string[];
  }>;
  const filtered = products;

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
        {filtered.map((product) => {
          const cover = product.images?.[0] ?? "/5.png";
          return (
            <Link
              key={product.id}
              href={`/magaza/${product.id}`}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-lg transition hover:shadow-2xl"
            >
              <div className="absolute right-4 top-4 rounded-full bg-sand px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                {product.tag ?? "Öne çıkan"}
              </div>
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={cover}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 px-5 py-4">
                <p className="heading-font text-xl text-foreground">{product.title}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-terracotta">{formatMoney(product.price)}</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)] group-hover:text-terracotta">
                    Detay
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </Stagger>
    </main>
  );
}
