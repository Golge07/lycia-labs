import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, orderTotal } from "../data";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

type Props = {
  params: Promise<{ id: string }>;
};

function formatMoney(amount: number) {
  return `₺${amount.toLocaleString("tr-TR")}`;
}

export default async function SiparisDetay({ params }: Props) {
  const resolved = await params;
  const order = getOrderById(resolved.id);
  if (!order) return notFound();

  const totals = orderTotal(order);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="heading-font text-2xl text-foreground">Sipariş Detayı</p>
          <p className="mt-1 text-sm text-[rgba(59,43,43,0.65)]">
            {order.id} • {order.date}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/panel/siparisler"
            className="rounded-full border border-[rgba(59,43,43,0.2)] bg-white/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-terracotta hover:text-terracotta"
          >
            Siparişlere Dön
          </Link>
          <OrderStatusSelect initialStatus={order.status} size="md" />
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
          <p className="heading-font text-lg text-foreground">Ürünler</p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(59,43,43,0.12)] bg-white/80">
            <div className="grid grid-cols-[1.6fr_0.4fr_0.6fr_0.6fr] gap-3 border-b border-[rgba(59,43,43,0.12)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(59,43,43,0.6)]">
              <span>Ürün</span>
              <span>Adet</span>
              <span>Birim</span>
              <span>Tutar</span>
            </div>
            <div className="divide-y divide-[rgba(59,43,43,0.12)]">
              {order.items.map((item) => (
                <div key={item.title} className="grid grid-cols-[1.6fr_0.4fr_0.6fr_0.6fr] gap-3 px-4 py-3 text-sm">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="font-semibold text-foreground">{item.qty}</p>
                  <p className="text-[rgba(59,43,43,0.75)]">{formatMoney(item.unitPrice)}</p>
                  <p className="font-semibold text-terracotta">{formatMoney(item.unitPrice * item.qty)}</p>
                </div>
              ))}
            </div>
          </div>

          {order.note ? (
            <div className="mt-4 rounded-2xl border border-[rgba(59,43,43,0.12)] bg-[rgba(230,215,194,0.28)] p-4 text-sm text-[rgba(59,43,43,0.75)]">
              <p className="font-semibold text-foreground">Not</p>
              <p className="mt-1">{order.note}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
            <p className="heading-font text-lg text-foreground">Müşteri</p>
            <div className="mt-3 space-y-2 text-sm text-[rgba(59,43,43,0.75)]">
              <p>
                <span className="font-semibold text-foreground">Ad:</span> {order.customer.name}
              </p>
              <p>
                <span className="font-semibold text-foreground">E-posta:</span> {order.customer.email}
              </p>
              <p>
                <span className="font-semibold text-foreground">Telefon:</span> {order.customer.phone}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
            <p className="heading-font text-lg text-foreground">Teslimat</p>
            <div className="mt-3 space-y-2 text-sm text-[rgba(59,43,43,0.75)]">
              <p className="font-semibold text-foreground">
                {order.shipping.district}, {order.shipping.city}
              </p>
              <p>{order.shipping.address}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[rgba(59,43,43,0.12)] bg-white/70 p-6 shadow-xl">
            <p className="heading-font text-lg text-foreground">Özet</p>
            <div className="mt-3 space-y-2 text-sm text-[rgba(59,43,43,0.75)]">
              <div className="flex items-center justify-between">
                <span>Ara toplam</span>
                <span className="font-semibold text-foreground">{formatMoney(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kargo</span>
                <span className="font-semibold text-foreground">
                  {totals.shipping === 0 ? "₺0" : formatMoney(totals.shipping)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(59,43,43,0.12)] pt-2">
                <span className="font-semibold text-foreground">Toplam</span>
                <span className="font-semibold text-terracotta">{formatMoney(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
