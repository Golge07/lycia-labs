import FAQ from "@/components/FAQ";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Stagger from "@/components/Stagger";

export default function Home() {
  return (
    <div className="space-y-20 bg-background px-6 pb-24 pt-6 text-foreground md:px-12 lg:px-20">
      <Reveal>
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Natural Glow</p>
            <h1 className="heading-font text-4xl leading-tight text-foreground md:text-5xl">
              Doğadan gelen sakinlik, <span className="text-terracotta">Lycia</span> dokunuşuyla.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[rgba(59,43,43,0.75)] md:text-lg">
              Akdeniz’in şifalı bitkilerinden ilham alan formüller; sade, temiz ve etkili. Cildiniz için ritüel, ruhunuz
              için denge.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/magaza"
                className="rounded-full bg-terracotta px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[rgba(167,68,68,0.25)] transition hover:shadow-xl"
              >
                Koleksiyonu Keşfet
              </Link>
              <Link
                href="/hakkimizda"
                className="rounded-full border border-[rgba(59,43,43,0.2)] px-6 py-3 text-base font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
              >
                Hikayemiz
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-base text-[rgba(59,43,43,0.65)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sage" />
                Bitkisel içerikler
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-terracotta" />
                Hayvanlar üzerinde test edilmez
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-clay" />
                Geri dönüştürülebilir paketler
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-linear-to-br from-[rgba(143,188,163,0.35)] to-[rgba(230,215,194,0.7)] blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/60 shadow-2xl backdrop-blur">
              <img src="/5.png" alt="Lycia ürünleri" className="h-full w-full object-cover" />
            </div>
          </div>
        </section>
      </Reveal>

      <section className="space-y-6">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-3xl bg-linear-to-r from-[rgba(203,139,115,0.12)] via-[rgba(143,188,163,0.1)] to-transparent p-6 shadow-xl md:flex-row md:items-center">
            <div className="overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/70 shadow-lg md:w-1/2">
              <img src="/3.png" alt="Lycia sahil" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-3 md:w-1/2">
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Ritüel 01</p>
              <h3 className="heading-font text-2xl text-foreground">Saf içerik, sakin dokunuş</h3>
              <p className="text-base text-[rgba(59,43,43,0.75)]">
                Bitki özleri, düşük irritasyonlu formüller ve hafif dokular. Günlük bakım rutini için hafif ama etkili bir
                temel.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-col-reverse gap-6 rounded-3xl bg-linear-to-l from-[rgba(203,139,115,0.12)] via-[rgba(143,188,163,0.08)] to-transparent p-6 shadow-xl md:flex-row md:items-center">
            <div className="space-y-3 md:w-1/2">
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Ritüel 02</p>
              <h3 className="heading-font text-2xl text-foreground">Akdeniz’den ilham</h3>
              <p className="text-base text-[rgba(59,43,43,0.75)]">
                Zeytin yaprakları, nar özleri ve minerallerle zenginleşen formüller; cildi dengelerken ferahlatıcı bir his
                bırakır.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/70 shadow-lg md:w-1/2">
              <img src="/4.png" alt="Doğal taşlar" className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className="grid items-center gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-olive">Hikayemiz</p>
            <h2 className="heading-font text-3xl text-foreground md:text-4xl">Akdeniz kıyılarından ilham</h2>
            <p className="max-w-3xl leading-relaxed text-[rgba(59,43,43,0.75)]">
              Lycia Labs, doğal içerikler ve minimalist formüllerle cilt bakımını yeniden tanımlar. Kum, tuz, zeytin
              yaprakları ve nar özleri; cildinize hafif ama derin bir yenilenme hissi sunar. Her ürün, saf ve dengeli bir
              deneyim yaratmak için geliştirildi.
            </p>
            <Stagger className="flex flex-wrap gap-3">
              {[
                { label: "Dermatolojik testli", color: "bg-[var(--sage)]" },
                { label: "Geri dönüştürülebilir ambalaj", color: "bg-sand" },
                { label: "Vegan", color: "bg-[var(--clay)]" },
                { label: "SLS/SLES içermez", color: "bg-terracotta text-white" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className={`rounded-full border border-[rgba(59,43,43,0.08)] px-3 py-1 text-sm font-medium shadow-sm ${chip.color} bg-opacity-60`}
                >
                  {chip.label}
                </span>
              ))}
            </Stagger>
          </div>
          <Stagger className="grid grid-cols-2 gap-3">
            {["/0.png", "/2.png", "/3.png", "/4.png"].map((src) => (
              <div
                key={src}
                className="overflow-hidden rounded-xl border border-[rgba(59,43,43,0.12)] bg-white/70 shadow-md"
              >
                <img src={src} alt="Lycia mood" className="h-32 w-full object-cover" />
              </div>
            ))}
          </Stagger>
        </section>
      </Reveal>

      <section className="space-y-6">
        <Reveal>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Seçili Ürünler</p>
              <h3 className="heading-font text-3xl text-foreground">Cildinize iyi gelecek dokunuşlar</h3>
              <p className="text-base text-[rgba(59,43,43,0.7)]">Koleksiyondan öne çıkanları keşfedin.</p>
            </div>
            <Link
              href="/magaza"
              className="rounded-full border border-[rgba(59,43,43,0.2)] px-5 py-2 text-base font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Tüm ürünler
            </Link>
          </div>
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Anti-Aging Cream", price: "₺780", img: "/5.png", tag: "En Çok Satan" },
            { title: "Gentle Cleanser", price: "₺520", img: "/6.png", tag: "Yeni" },
            { title: "Hydra Serum", price: "₺640", img: "/7.png", tag: "Nem Bombası" },
          ].map((product) => (
            <div
              key={product.title}
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
                <p className="text-base text-[rgba(59,43,43,0.65)]">Bitkisel kompleks, nemlendirme ve onarım</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold text-terracotta">{product.price}</span>
                  <Link
                    href="/magaza"
                    className="rounded-full bg-terracotta px-4 py-2 text-base font-semibold text-white shadow-md transition hover:shadow-lg"
                  >
                    Ürüne Git
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Stagger>
      </section>

      <Reveal>
        <section className="overflow-hidden rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/80 shadow-2xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 p-6 md:col-span-2 md:p-8">
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Hakkımızda</p>
              <h4 className="heading-font text-3xl text-foreground">Lycia’nın özü</h4>
              <p className="text-base text-[rgba(59,43,43,0.75)]">
                Akdeniz’in doğallığını rafine formüllerle buluşturuyoruz. Şeffaf üretim, temiz içerik, duyusal dokular ve
                sürdürülebilir ambalaj yaklaşımıyla her ürün dengeli bir ritüel sunar.
              </p>
              <Stagger className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Temiz içerik", desc: "Bitki özleri, düşük irritasyonlu bileşenler." },
                  { title: "Sürdürülebilirlik", desc: "Geri dönüştürülebilir ambalaj ve etik tedarik." },
                  { title: "Bilim + Doğa", desc: "Denge, pH uyumu ve etkili aktifler." },
                  { title: "Duyusal deneyim", desc: "Hafif dokular, sakin koku profilleri." },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[rgba(59,43,43,0.08)] bg-white/90 p-4 shadow-sm"
                  >
                    <p className="heading-font text-base text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-[rgba(59,43,43,0.7)]">{item.desc}</p>
                  </div>
                ))}
              </Stagger>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg"
              >
                Detayları gör <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-b from-[rgba(167,68,68,0.08)] to-[rgba(143,188,163,0.08)]" />
              <img src="/2.png" alt="Lycia doğa" className="relative h-full w-full object-cover" />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <FAQ />
      </Reveal>

      <Reveal>
        <section className="relative z-10 mx-6 mb-8 rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/80 px-6 py-8 shadow-xl md:mx-12 lg:mx-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Kampanyalar</p>
              <h4 className="heading-font text-2xl text-foreground">Kampanyalarımızı kaçırma</h4>
              <p className="text-base text-[rgba(59,43,43,0.75)]">
                Yeni ürün duyuruları ve özel indirimler için e-posta bırak.
              </p>
            </div>
            <form className="flex w-full max-w-md flex-col gap-3 md:flex-row">
              <input
                type="email"
                className="flex-1 rounded-full border border-[rgba(59,43,43,0.15)] bg-white/90 px-4 py-3 text-foreground placeholder:text-[rgba(59,43,43,0.4)] focus:border-terracotta focus:outline-none"
                placeholder="ornek@mail.com"
              />
              <button className="rounded-full bg-terracotta px-5 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-lg">
                Abone Ol
              </button>
            </form>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
