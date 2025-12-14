import Link from "next/link";
import { adminOrders, orderTotal } from "./data";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default async function PanelSiparisler({ searchParams }: Props) {
  const resolved = (await searchParams) ?? {};
  const q = (resolved.q ?? "").trim();
  const filtered = q ? adminOrders.filter((o) => o.id.toLowerCase().includes(q.toLowerCase())) : adminOrders;

  return (
    <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Siparişler</p>
          <p className="mt-1 text-sm text-[rgba(59,43,43,0.65)]">Sipariş ID ile hızlı arama</p>
        </div>

        <form action="/panel/siparisler" method="get" className="flex w-full max-w-md gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Sipariş ID (örn. SP-10421)"
            className="w-full rounded-full border border-[rgba(59,43,43,0.18)] bg-white/90 px-4 py-2 text-sm text-foreground placeholder:text-[rgba(59,43,43,0.45)] focus:border-terracotta focus:outline-none"
          />
          <button className="shrink-0 rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg">
            Ara
          </button>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-[rgba(59,43,43,0.65)]">
        <p>
          Gösterilen: <span className="font-semibold text-foreground">{filtered.length}</span> / {adminOrders.length}
        </p>
        {q ? (
          <Link href="/panel/siparisler" className="text-terracotta hover:underline">
            Aramayı temizle
          </Link>
        ) : null}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80">
        <div className="grid grid-cols-[1fr_1.2fr_0.8fr_0.9fr] gap-3 border-b border-[rgba(59,43,43,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">
          <span>Sipariş</span>
          <span>Müşteri</span>
          <span>Tutar</span>
          <span>Durum</span>
        </div>
        <div className="divide-y divide-[rgba(59,43,43,0.12)]">
          {filtered.map((o) => {
            const total = orderTotal(o).total;
            return (
              <Link
                key={o.id}
                href={`/panel/siparisler/${encodeURIComponent(o.id)}`}
                className="grid grid-cols-[1fr_1.2fr_0.8fr_0.9fr] gap-3 px-4 py-3 text-sm text-[rgba(59,43,43,0.8)] transition hover:bg-[rgba(230,215,194,0.25)]"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{o.id}</p>
                  <p className="text-xs text-[rgba(59,43,43,0.6)]">{o.date}</p>
                </div>
                <p className="font-medium text-foreground">{o.customer.name}</p>
                <p className="font-semibold text-terracotta">{formatMoney(total)}</p>
                <OrderStatusSelect initialStatus={o.status} />
              </Link>
            );
          })}

          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-[rgba(59,43,43,0.65)]">
              Sonuç bulunamadı.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
