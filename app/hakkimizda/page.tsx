export default function HakkimizdaPage() {

  return (
    <div className="relative z-10 space-y-14 px-6 pb-16 pt-12 md:px-8 lg:px-14">
      <section className="grid gap-8 overflow-hidden rounded-3xl border border-[rgba(59,43,43,0.12)] bg-gradient-to-r from-[rgba(203,139,115,0.12)] via-[rgba(143,188,163,0.1)] to-[rgba(230,215,194,0.08)] shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 p-6 md:p-8">
          <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Hakkımızda</p>
          <h1 className="heading-font text-4xl text-foreground">Lycia’nın hikayesi</h1>
          <p className="text-[rgba(59,43,43,0.75)] leading-relaxed">
            Lycia Labs, Akdeniz’in sakinliğini ve doğanın gücünü modern cilt bakımına taşıyor. Temiz içerikler,
            minimalist formüller ve duyusal ritüeller üzerine kurulu bir koleksiyon oluşturuyoruz. Supabase ile
            yönetilen ürün katalogları, Vercel üzerinde hızlı dağıtım ve Next.js ile optimize edilmiş bir frontend
            deneyimi hedefliyoruz.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Temiz içerik", desc: "Bitkisel özler, düşük irritasyon, saf formüller." },
              { title: "Sürdürülebilirlik", desc: "Geri dönüştürülebilir ambalaj ve etik tedarik." },
              { title: "Bilim + Doğa", desc: "Laboratuvar doğrulaması, pH dengesi, etkin aktifler." },
              { title: "Duyusal deneyim", desc: "Hafif dokular, sakin koku profilleri." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[rgba(59,43,43,0.08)] bg-white/80 p-4 shadow-sm">
                <p className="heading-font text-base text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-[rgba(59,43,43,0.7)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(167,68,68,0.1)] to-[rgba(143,188,163,0.12)]" />
          <img src="/5.png" alt="Lycia ürünleri" className="relative h-full w-full object-cover" />
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-[rgba(59,43,43,0.12)] bg-gradient-to-r from-[rgba(143,188,163,0.12)] to-[rgba(230,215,194,0.12)] p-6 shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Zaman Çizgisi</p>
          <h2 className="heading-font text-3xl text-foreground">Köklerimiz ve yolculuğumuz</h2>
          <div className="relative flex flex-col gap-4">
            <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-gradient-to-b from-terracotta/50 via-sand to-olive/60" />
            {[
              { year: "2018", text: "Akdeniz botaniklerinden ilhamla Ar-Ge başlangıcı." },
              { year: "2020", text: "İlk temiz içerik koleksiyonunun lansmanı." },
              { year: "2023", text: "Sürdürülebilir ambalaj dönüşümü ve yeni serumlar." },
              { year: "2025", text: "Supabase ile canlı stok & içerik şeffaflığı paneli." },
            ].map((row, idx) => (
              <div key={row.year} className="relative flex gap-3 rounded-xl bg-white/80 p-4 shadow-sm">
                <span className="relative z-10 mt-1 h-3 w-3 rounded-full bg-terracotta" />
                <div className="space-y-1">
                  <p className="heading-font text-sm text-terracotta">{row.year}</p>
                  <p className="text-sm text-[rgba(59,43,43,0.75)]">{row.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Değerler</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Dermatolojik testli formüller",
              "Vegan ve cruelty-free",
              "Şeffaf içerik listeleri",
              "Sürdürülebilir tedarik zinciri",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[rgba(59,43,43,0.1)] bg-white/80 p-4 shadow-sm">
                <p className="text-sm text-[rgba(59,43,43,0.8)]">{item}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/90 p-4 shadow-sm">
            <p className="heading-font text-base text-foreground">Teknoloji</p>
            <p className="mt-1 text-sm text-[rgba(59,43,43,0.7)]">
              Supabase ile içerik ve stok takibi, Next.js ile hızlı UI, Vercel üzerinden güvenilir dağıtım.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-[rgba(59,43,43,0.12)] bg-gradient-to-r from-[rgba(203,139,115,0.08)] to-[rgba(143,188,163,0.08)] p-6 shadow-xl lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">Taahhüdümüz</p>
          <h3 className="heading-font text-2xl text-foreground">Her adımda şeffaflık</h3>
          <p className="text-sm text-[rgba(59,43,43,0.75)]">
            Formülasyonlardan ambalaja kadar her aşamada izlenebilirlik sağlıyor, Supabase üzerinden ürün bilgilerini
            gerçek zamanlı yönetiyoruz. Kullanıcı deneyimini Next.js ve Vercel altyapısıyla hızlı ve güvenilir kılıyoruz.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-[rgba(59,43,43,0.7)]">
            <span className="rounded-full bg-sand/70 px-3 py-1 shadow-sm">Temiz İçerik Politikası</span>
            <span className="rounded-full bg-[var(--sage)]/70 px-3 py-1 shadow-sm">Şeffaflık Raporu</span>
            <span className="rounded-full bg-terracotta/70 px-3 py-1 text-white shadow-sm">%100 Vegan</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white shadow-lg">
          <img src="/0.png" alt="Lycia manzara" className="h-full w-full object-cover" />
        </div>
      </section>
    </div >
  )
}
