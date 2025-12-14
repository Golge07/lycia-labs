import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

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

export async function GET(request: NextRequest) {
  try {
    await requireOwner(request);
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();

    const products = await prisma.product.findMany({
      where: q ? { title: { contains: q, mode: "insensitive" } } : undefined,
      orderBy: { updated_at: "desc" },
      take: 200,
      select: { id: true, title: true, price: true, stock: true, tag: true, category: true, active: true, images: true },
    });

    return NextResponse.json(
      products.map((p) => ({
        ...p,
        price: Number(p.price),
        images: Array.isArray(p.images) ? p.images : p.images ? (p.images as any) : [],
      })),
    );
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json(err, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireOwner(request);

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

    const title = (payload.title ?? "").trim();
    if (!title) return NextResponse.json({ message: "Title required" }, { status: 400 });

    const created = await prisma.product.create({
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
      select: { id: true },
    });

    revalidateTag("products", "max");
    revalidateTag(`product:${created.id}`, "max");

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
