export type OrderItem = {
  title: string;
  qty: number;
  unitPrice: number;
};

export type OrderStatus = "Hazırlanıyor" | "Kargoda" | "Tamamlandı" | "İptal edildi" | "İade edildi";

export type AdminOrder = {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    district: string;
  };
  status: OrderStatus;
  items: OrderItem[];
  note?: string;
};

export const adminOrders: AdminOrder[] = [
  {
    id: "SP-10421",
    date: "2025-12-14 14:12",
    status: "Hazırlanıyor",
    customer: { name: "Ayşe Yılmaz", email: "ayse@example.com", phone: "+90 555 000 00 00" },
    shipping: { address: "Levent Mah. Örnek Sk. No: 12 D: 4", city: "İstanbul", district: "Beşiktaş" },
    items: [
      { title: "Anti-Aging Cream", qty: 1, unitPrice: 780 },
      { title: "Mineral Toner", qty: 1, unitPrice: 450 },
    ],
    note: "Kapıda teslim.",
  },
  {
    id: "SP-10420",
    date: "2025-12-14 12:40",
    status: "Hazırlanıyor",
    customer: { name: "Mehmet Demir", email: "mehmet@example.com", phone: "+90 555 000 00 00" },
    shipping: { address: "Maslak Mah. Örnek Cd. No: 45", city: "İstanbul", district: "Sarıyer" },
    items: [{ title: "Gentle Cleanser", qty: 1, unitPrice: 520 }],
  },
  {
    id: "SP-10419",
    date: "2025-12-13 18:05",
    status: "Hazırlanıyor",
    customer: { name: "Elif Kaya", email: "elif@example.com", phone: "+90 555 000 00 00" },
    shipping: { address: "Kordon Boyu, Örnek Apt. 7/2", city: "İzmir", district: "Konak" },
    items: [
      { title: "Hydra Serum", qty: 1, unitPrice: 640 },
      { title: "Vitamin C Serum", qty: 1, unitPrice: 690 },
    ],
  },
  {
    id: "SP-10418",
    date: "2025-12-13 10:22",
    status: "Hazırlanıyor",
    customer: { name: "Can Akın", email: "can@example.com", phone: "+90 555 000 00 00" },
    shipping: { address: "Örnek Mah. 100. Yıl Sk. No: 3", city: "Ankara", district: "Çankaya" },
    items: [{ title: "Mineral Toner", qty: 1, unitPrice: 450 }],
    note: "Müşteri talebi ile iptal edildi.",
  },
  {
    id: "SP-10417",
    date: "2025-12-12 09:10",
    status: "Hazırlanıyor",
    customer: { name: "Deniz Arı", email: "deniz@example.com", phone: "+90 555 000 00 00" },
    shipping: { address: "Örnek Cad. No: 18", city: "Antalya", district: "Muratpaşa" },
    items: [{ title: "Night Repair Oil", qty: 1, unitPrice: 820 }],
    note: "Ürün iade edildi, ücret geri ödendi.",
  },
];

export function orderTotal(order: AdminOrder) {
  const subtotal = order.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const shipping = subtotal >= 1000 ? 0 : 49;
  return { subtotal, shipping, total: subtotal + shipping };
}

export function getOrderById(id: string) {
  return adminOrders.find((o) => o.id.toLowerCase() === id.toLowerCase());
}
