import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function asStringArray(value: unknown): string[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const kategori = (url.searchParams.get("kategori") ?? "").trim();

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(kategori && kategori !== "all" ? { category: kategori } : {}),
    },
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

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      tag: p.tag,
      category: p.category,
      stock: p.stock,
      images: asStringArray(p.images),
    })),
  );
}

