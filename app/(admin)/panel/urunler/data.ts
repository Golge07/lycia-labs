export const stockByProductId: Record<number, number> = {
  101: 62,
  102: 41,
  103: 18,
  104: 0,
  105: 24,
  106: 9,
};

export function statusFromStock(stock: number) {
  if (stock <= 0) return "Tükendi";
  if (stock < 20) return "Az Stok";
  return "Aktif";
}

