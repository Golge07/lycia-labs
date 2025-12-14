import Link from "next/link";

type Stat = {
  label: string;
  value: string;
  hint: string;
  tone: "terracotta" | "sage" | "olive" | "sand";
};

const stats: Stat[] = [
  { label: "Günlük Ciro", value: "₺12.480", hint: "+%8 (düne göre)", tone: "terracotta" },
  { label: "Toplam Ciro", value: "₺482.910", hint: "Son 30 gün", tone: "sage" },
  { label: "Günlük Sipariş", value: "34", hint: "İptal: 1", tone: "olive" },
  { label: "Toplam Sipariş", value: "1.284", hint: "Ortalama sepet: ₺376", tone: "sand" },
];

const distribution = [
  { label: "Bakım", percent: 46, color: "bg-terracotta/80" },
  { label: "Serum", percent: 28, color: "bg-[var(--sage)]/80" },
  { label: "Temizlik", percent: 19, color: "bg-[var(--clay)]/80" },
  { label: "Diğer", percent: 7, color: "bg-[var(--olive)]/70" },
];

const recentOrders = [
  { id: "SP-10421", customer: "Ayşe Yılmaz", total: "₺780", status: "Hazırlanıyor", date: "Bugün 14:12" },
  { id: "SP-10420", customer: "Mehmet Demir", total: "₺520", status: "Kargoda", date: "Bugün 12:40" },
  { id: "SP-10419", customer: "Elif Kaya", total: "₺1.340", status: "Tamamlandı", date: "Dün 18:05" },
  { id: "SP-10418", customer: "Can Akın", total: "₺450", status: "İptal edildi", date: "Dün 10:22" },
];

const toneStyles: Record<Stat["tone"], string> = {
  terracotta: "bg-terracotta/10 border-terracotta/20",
  sage: "bg-[var(--sage)]/10 border-[var(--sage)]/20",
  olive: "bg-[var(--olive)]/10 border-[var(--olive)]/20",
  sand: "bg-sand/40 border-sand/60",
};

export default function PanelDashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-3xl border p-5 shadow-sm transition hover:shadow-md ${toneStyles[s.tone]}`}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">{s.label}</p>
            <p className="mt-2 heading-font text-3xl text-foreground">{s.value}</p>
            <p className="mt-2 text-sm text-[rgba(59,43,43,0.7)]">{s.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="heading-font text-lg text-foreground">Satış Dağılımı</p>
              <p className="text-sm text-[rgba(59,43,43,0.65)]">Kategori bazlı oranlar</p>
            </div>
            <p className="text-sm text-[rgba(59,43,43,0.65)]">Son 7 gün</p>
          </div>

          <div className="mt-5 space-y-3">
            {distribution.map((row) => (
              <div key={row.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-[rgba(59,43,43,0.8)]">
                  <span className="font-semibold text-foreground">{row.label}</span>
                  <span>{row.percent}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[rgba(59,43,43,0.08)]">
                  <div className={`h-full ${row.color}`} style={{ width: `${row.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80 p-4 shadow-sm sm:grid-cols-2">
            <div>
              <p className="text-sm text-[rgba(59,43,43,0.65)]">Dönüşüm</p>
              <p className="mt-1 heading-font text-2xl text-foreground">%2,8</p>
            </div>
            <div>
              <p className="text-sm text-[rgba(59,43,43,0.65)]">İade Oranı</p>
              <p className="mt-1 heading-font text-2xl text-foreground">%1,1</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="heading-font text-lg text-foreground">Son Siparişler</p>
              <p className="text-sm text-[rgba(59,43,43,0.65)]">Hızlı kontrol</p>
            </div>
            <Link
              href="/panel/siparisler"
              className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80">
            <div className="grid grid-cols-[1fr_1.2fr_0.7fr_0.9fr] gap-3 border-b border-[rgba(59,43,43,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">
              <span>Sipariş</span>
              <span>Müşteri</span>
              <span>Tutar</span>
              <span>Durum</span>
            </div>
            <div className="divide-y divide-[rgba(59,43,43,0.12)]">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/panel/siparisler/${encodeURIComponent(o.id)}`}
                  className="grid grid-cols-[1fr_1.2fr_0.7fr_0.9fr] gap-3 px-4 py-3 text-sm text-[rgba(59,43,43,0.8)] transition hover:bg-[rgba(230,215,194,0.25)]"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{o.id}</p>
                    <p className="text-xs text-[rgba(59,43,43,0.6)]">{o.date}</p>
                  </div>
                  <p className="font-medium text-foreground">{o.customer}</p>
                  <p className="font-semibold text-terracotta">{o.total}</p>
                  <span className="inline-flex h-fit w-fit rounded-full bg-[rgba(59,43,43,0.06)] px-3 py-1 text-xs font-semibold text-foreground">
                    {o.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
