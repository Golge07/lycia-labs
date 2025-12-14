import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Stagger from "@/components/Stagger";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchase from "@/components/ProductPurchase";

type Props = {
  params: Promise<{ id: string }>;
};

const galleryFallbacks = ["/5.png", "/6.png", "/7.png", "/3.png"];

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

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const id = Number(resolved.id);
  if (!Number.isFinite(id)) return {};

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { tags: ["products", `product:${id}`] } });
  const product = (await res.json().catch(() => null)) as null | {
    id: number;
    title: string;
    description: string | null;
    price: number;
    tag: string | null;
    category: string | null;
    stock: number;
    images: string[];
  };
  if (!product) return {};

  const title = `${product.title} | Lycia Labs`;
  const description =
    product.description ??
    "Temiz içerikler ve dengeli formüllerle tasarlanmış, cildinize nazik bir bakım sunar.";
  const image = product.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function UrunDetay({ params }: Props) {
  const resolved = await params;
  const id = Number(resolved.id);
  if (!Number.isFinite(id)) return notFound();

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products/${id}`, { next: { tags: ["products", `product:${id}`] } });
  if (!res.ok) return notFound();
  const product = (await res.json()) as {
    id: number;
    title: string;
    description: string | null;
    price: number;
    tag: string | null;
    category: string | null;
    stock: number;
    images: string[];
  };
  if (!product) return notFound();

  const base = product.images.length ? product.images : [];
  const images = [...base, ...galleryFallbacks.filter((g) => !base.includes(g))].slice(0, 4);
  const priceText = formatMoney(product.price);

  const listRes = await fetch(
    `${baseUrl}/api/products${product.category ? `?kategori=${encodeURIComponent(product.category)}` : ""}`,
    { next: { tags: ["products"] } },
  );
  const all = (await listRes.json().catch(() => [])) as Array<{
    id: number;
    title: string;
    description: string | null;
    price: number;
    tag: string | null;
    category: string | null;
    stock: number;
    images: string[];
  }>;
  const similar = all
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[-10%] h-72 w-72 rounded-full bg-[rgba(167,68,68,0.08)] blur-3xl" />
        <div className="absolute right-[-10%] top-10 h-80 w-80 rounded-full bg-[rgba(143,188,163,0.08)] blur-3xl" />
      </div>

      <main className="relative z-10 space-y-10 px-6 pb-16 pt-10 md:px-10 lg:px-14">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Ürün Detayı</p>
              <h1 className="heading-font text-4xl text-foreground">{product.title}</h1>
              <p className="text-base text-[rgba(59,43,43,0.65)]">{(product.category ?? "-").toUpperCase()}</p>
            </div>
            <Link
              href="/magaza"
              className="rounded-full border border-[rgba(59,43,43,0.2)] px-4 py-2 text-base text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              ← Mağazaya dön
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <ProductGallery title={product.title} images={images} />
          </Reveal>

          <Reveal delay={0.05}>
            <div className="space-y-4 rounded-3xl p-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-sand px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                  {product.tag ?? "Öne çıkan"}
                </span>
                <span className="rounded-full bg-terracotta/10 px-3 py-1 text-sm font-semibold text-terracotta">
                  {(product.category ?? "-").toUpperCase()}
                </span>
              </div>

              <p className="heading-font text-3xl text-foreground">{product.title}</p>

              <p className="text-base text-[rgba(59,43,43,0.75)]">
                {product.description ??
                  "Temiz içerikler ve dengeli formüllerle tasarlanmış, cildinize nazik bir bakım sunar."}
              </p>

              <div className="grid gap-2 text-base text-[rgba(59,43,43,0.7)]">
                <span>• Bitkisel içerikler, temiz formül</span>
                <span>• Gönderim: 2–4 iş günü, iade: 30 gün</span>
                <span>• Güvenli ödeme</span>
              </div>

              <div className="grid gap-3 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-[rgba(143,188,163,0.06)] p-4 shadow-sm md:grid-cols-2">
                {[
                  { label: "İçerik", value: "Bitkisel kompleks, hyaluronik asit" },
                  { label: "Cilt tipi", value: "Tüm cilt tipleri" },
                  { label: "Hacim", value: "150 ml" },
                  { label: "Kullanım", value: "Sabah/akşam temiz cilde uygulayın" },
                ].map((row) => (
                  <div key={row.label} className="space-y-1 rounded-xl bg-white/20 p-3 shadow-inner">
                    <p className="text-xs uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">{row.label}</p>
                    <p className="text-base text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>

              <ProductPurchase productId={product.id} title={product.title} price={priceText} img={product.images[0] ?? "/5.png"} />
            </div>
          </Reveal>
        </div>

        <section className="space-y-4">
          <Reveal>
            <div className="flex items-center justify-between">
              <div>
                <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Benzer Ürünler</p>
                <h3 className="heading-font text-2xl text-foreground">Sana da iyi gelebilir</h3>
              </div>
              <Link href="/magaza" className="text-base text-terracotta hover:underline">
                Tüm ürünler →
              </Link>
            </div>
          </Reveal>

          <Stagger className="grid gap-4 md:grid-cols-3">
            {similar.map((item) => (
              <Link
                key={item.id}
                href={`/magaza/${item.id}`}
                className="group overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-md transition hover:shadow-xl"
              >
                <div className="h-32 w-full overflow-hidden">
                  <img
                    src={item.images[0] ?? "/5.png"}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1 px-4 py-3">
                  <p className="heading-font text-base text-foreground">{item.title}</p>
                  <p className="text-base font-semibold text-terracotta">{formatMoney(item.price)}</p>
                </div>
              </Link>
            ))}
          </Stagger>
        </section>
      </main>
    </div>
  );
}
