export type Product = {
  id: number;
  title: string;
  price: string;
  img: string;
  tag: string;
  category: string;
  description?: string;
};

export const products: Product[] = [
  {
    id: 101,
    title: "Anti-Aging Cream",
    price: "₺780",
    img: "/5.png",
    tag: "En Çok Satan",
    category: "bakim",
    description: "Hassas ciltler için bitkisel anti-aging kompleks.",
  },
  {
    id: 102,
    title: "Gentle Cleanser",
    price: "₺520",
    img: "/6.png",
    tag: "Yeni",
    category: "temizlik",
    description: "Sulfatsız, nazik temizlik sağlayan yüz temizleme jeli.",
  },
  {
    id: 103,
    title: "Hydra Serum",
    price: "₺640",
    img: "/7.png",
    tag: "Nem Bombası",
    category: "serum",
    description: "Hyaluronik asit ve bitki özleriyle yoğun nem desteği.",
  },
  {
    id: 104,
    title: "Mineral Toner",
    price: "₺450",
    img: "/3.png",
    tag: "Denge",
    category: "temizlik",
    description: "Mineral içerikli, cildi dengeleyen ve gözenek sıkılaştıran toner.",
  },
  {
    id: 105,
    title: "Vitamin C Serum",
    price: "₺690",
    img: "/4.png",
    tag: "Parlaklık",
    category: "serum",
    description: "C vitamini ve antioksidan karışımıyla aydınlatıcı serum.",
  },
  {
    id: 106,
    title: "Night Repair Oil",
    price: "₺820",
    img: "/2.png",
    tag: "Bakım",
    category: "bakim",
    description: "Gece bakımında onarıcı, besleyici yağ karışımı.",
  },
];
