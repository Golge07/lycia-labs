import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type PublicProduct = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  tag: string | null;
  category: string | null;
  stock: number;
  images: string[];
};

function toImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string");
}

export const getPublicProducts = unstable_cache(
  async (category: string | null = null): Promise<PublicProduct[]> => {
    const products = await prisma.product.findMany({
      where: { active: true, ...(category ? { category } : {}) },
      orderBy: { updated_at: "desc" },
      take: 500,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        tag: true,
        category: true,
        stock: true,
        images: true,
      },
    });

    return products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      tag: p.tag,
      category: p.category,
      stock: p.stock,
      images: toImages(p.images),
    }));
  },
  ["public-products"],
  { tags: ["products"] },
);

export async function getPublicProductById(id: number): Promise<PublicProduct | null> {
  return unstable_cache(
    async () => {
      const product = await prisma.product.findFirst({
        where: { id, active: true },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          tag: true,
          category: true,
          stock: true,
          images: true,
        },
      });
      if (!product) return null;

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        tag: product.tag,
        category: product.category,
        stock: product.stock,
        images: toImages(product.images),
      };
    },
    ["public-product-by-id", String(id)],
    { tags: ["products", `product:${id}`] },
  )();
}
