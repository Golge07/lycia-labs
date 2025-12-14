const customers = [
  { name: "Ayşe Yılmaz", email: "ayse@example.com", tier: "Standart", orders: 12, last: "2025-12-14" },
  { name: "Mehmet Demir", email: "mehmet@example.com", tier: "VIP", orders: 28, last: "2025-12-14" },
  { name: "Elif Kaya", email: "elif@example.com", tier: "Standart", orders: 7, last: "2025-12-13" },
  { name: "Can Akın", email: "can@example.com", tier: "Yeni", orders: 1, last: "2025-12-13" },
];

export default function PanelMusteriler() {
  return (
    <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Müşteri Hesapları</p>
          <p className="mt-1 text-sm text-[rgba(59,43,43,0.65)]">Kayıtlar ve temel segment</p>
        </div>
        <button className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta">
          Dışa Aktar
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80">
        <div className="grid grid-cols-[1.2fr_1.6fr_0.8fr_0.6fr_0.8fr] gap-3 border-b border-[rgba(59,43,43,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">
          <span>Ad Soyad</span>
          <span>E-posta</span>
          <span>Segment</span>
          <span>Sipariş</span>
          <span>Son</span>
        </div>
        <div className="divide-y divide-[rgba(59,43,43,0.12)]">
          {customers.map((c) => (
            <div
              key={c.email}
              className="grid grid-cols-[1.2fr_1.6fr_0.8fr_0.6fr_0.8fr] gap-3 px-4 py-3 text-sm text-[rgba(59,43,43,0.8)] transition hover:bg-[rgba(230,215,194,0.25)]"
            >
              <p className="font-semibold text-foreground">{c.name}</p>
              <p className="text-[rgba(59,43,43,0.75)]">{c.email}</p>
              <span className="inline-flex h-fit w-fit rounded-full bg-[rgba(59,43,43,0.06)] px-3 py-1 text-xs font-semibold text-foreground">
                {c.tier}
              </span>
              <p className="font-semibold text-terracotta">{c.orders}</p>
              <p className="text-[rgba(59,43,43,0.7)]">{c.last}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

