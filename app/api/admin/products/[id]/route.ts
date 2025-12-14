import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

type Params = {
  params: Promise<{ id: string }>;
};

function clampInt(n: unknown, min: number, max: number) {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return min;
  return Math.max(min, Math.min(max, Math.floor(num)));
}

function clampMoney(n: unknown) {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.round(num * 100) / 100);
}

function asStringArray(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input.filter((x) => typeof x === "string").map((x) => x.trim()).filter(Boolean);
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireOwner(request);
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isFinite(productId)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const product = await prisma.product.findFirst({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        tag: true,
        category: true,
        stock: true,
        images: true,
        active: true,
      },
    });
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      images: Array.isArray(product.images) ? product.images : product.images ? (product.images as any) : [],
    });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireOwner(request);
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isFinite(productId)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

    const payload = (await request.json().catch(() => ({}))) as Partial<{
      title: string;
      description: string;
      price: number | string;
      tag: string;
      category: string;
      stock: number | string;
      images: string[];
      active: boolean;
    }>;

    const title = payload.title?.trim();
    if (!title) return NextResponse.json({ message: "Title required" }, { status: 400 });

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        title: title.slice(0, 140),
        description: payload.description?.trim() ? payload.description.trim() : null,
        price: new Prisma.Decimal(clampMoney(payload.price)),
        tag: payload.tag?.trim() ? payload.tag.trim().slice(0, 80) : null,
        category: payload.category?.trim() ? payload.category.trim().slice(0, 80) : null,
        stock: clampInt(payload.stock, 0, 999999),
        images: asStringArray(payload.images),
        active: payload.active ?? true,
      },
      select: { id: true, updated_at: true },
    });

    revalidateTag("products","max");
    revalidateTag(`product:${productId}`,"max");

    return NextResponse.json({ ok: true, product: updated });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
