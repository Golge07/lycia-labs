import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

function asStringArray(value: unknown): string[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
}

export async function GET(_request: NextRequest, { params }: Params) {
  const resolved = await params;
  const id = Number(resolved.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const p = await prisma.product.findFirst({
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

  if (!p) return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: p.id,
    title: p.title,
    description: p.description,
    price: Number(p.price),
    tag: p.tag,
    category: p.category,
    stock: p.stock,
    images: asStringArray(p.images),
  });
}

