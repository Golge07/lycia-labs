import Reveal from "@/components/Reveal";

export default function Iletisim() {
  return (
    <main className="relative z-10 bg-[var(--background)] px-6 pb-16 pt-10 text-foreground md:px-10 lg:px-14">
      <div className="grid gap-8 rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-6 shadow-2xl lg:grid-cols-2">
        <Reveal>
          <section className="space-y-4">
            <p className="heading-font text-sm uppercase tracking-[0.3em] text-terracotta">İletişim</p>
            <h1 className="heading-font text-3xl text-foreground">Bize ulaşın</h1>
            <p className="leading-relaxed text-[rgba(59,43,43,0.75)]">
              Distribütörlük, basın veya iş birliği talepleriniz için formu doldurun. (Demo: Mesajlar şu an kaydedilmez.)
            </p>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-base text-[rgba(59,43,43,0.7)]">Ad Soyad</label>
                  <input
                    className="w-full rounded-xl border border-[rgba(59,43,43,0.15)] bg-white/80 px-4 py-3 text-foreground placeholder:text-[rgba(59,43,43,0.4)] focus:border-[var(--terracotta)] focus:outline-none"
                    placeholder="Örn. Ayşe Yılmaz"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base text-[rgba(59,43,43,0.7)]">E-posta</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-[rgba(59,43,43,0.15)] bg-white/80 px-4 py-3 text-foreground placeholder:text-[rgba(59,43,43,0.4)] focus:border-[var(--terracotta)] focus:outline-none"
                    placeholder="mail@ornek.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-base text-[rgba(59,43,43,0.7)]">Mesaj</label>
                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-[rgba(59,43,43,0.15)] bg-white/80 px-4 py-3 text-foreground placeholder:text-[rgba(59,43,43,0.4)] focus:border-[var(--terracotta)] focus:outline-none"
                  placeholder="Merhaba, markanızla ilgili..."
                />
              </div>
              <button className="w-full rounded-full bg-[var(--terracotta)] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[rgba(167,68,68,0.2)] transition hover:shadow-xl">
                Mesajı Gönder
              </button>
            </form>
          </section>
        </Reveal>

        <Reveal delay={0.05}>
          <aside className="space-y-4 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/90 p-4 shadow-xl">
            <p className="heading-font text-lg text-foreground">Lokasyon</p>
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[rgba(59,43,43,0.12)] shadow-md">
              <iframe
                title="Lycia Labs Harita"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12042.207147933418!2d29.000000000000004!3d41.040000000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDAyJzI0LjAiTiAyOcKwMDAnMDAuMCJF!5e0!3m2!1str!2str!4v1710000000000"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="space-y-2 text-base text-[rgba(59,43,43,0.75)]">
              <p>
                <span className="font-semibold text-foreground">Adres:</span> Levent, İstanbul (örnek konum)
              </p>
              <p>
                <span className="font-semibold text-foreground">Telefon:</span> +90 212 000 00 00
              </p>
              <p>
                <span className="font-semibold text-foreground">E-posta:</span> hello@lycialabs.com
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </main>
  );
}
