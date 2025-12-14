import { requireSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";

type IncomingItem = {
  productId: number;
  title: string;
  img: string;
  unitPrice: number;
  qty: number;
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

export async function GET(request: NextRequest) {
  try {
    const user = await requireSessionUser(request);
    const orders = await prisma.order.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        status: true,
        total_amount: true,
        created_at: true,
        items: { select: { id: true } },
      },
    });

    return NextResponse.json(
      orders.map((o) => ({
        id: o.id,
        status: o.status,
        total: Number(o.total_amount),
        created_at: o.created_at,
        item_count: o.items.length,
      })),
    );
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser(request);
    const payload = (await request.json().catch(() => ({}))) as { items?: IncomingItem[]; note?: string };

    const addressMissing =
      !user.first_name?.trim() ||
      !user.last_name?.trim() ||
      !user.phone?.trim() ||
      !user.address_line1?.trim() ||
      !user.city?.trim() ||
      !user.district?.trim();

    if (addressMissing) {
      return NextResponse.json(
        { message: "Adres bilgilerin eksik. Sipariş vermek için önce adresini tamamla." },
        { status: 400 },
      );
    }

    const rawItems = Array.isArray(payload.items) ? payload.items : [];
    const items = rawItems
      .filter((x) => x && typeof x.title === "string")
      .map((x) => {
        const qty = clampInt(x.qty, 1, 99);
        const unitPrice = clampMoney(x.unitPrice);
        const lineTotal = clampMoney(unitPrice * qty);
        return {
          productId: typeof x.productId === "number" ? x.productId : Number(x.productId),
          title: String(x.title).slice(0, 140),
          img: typeof x.img === "string" ? x.img : "",
          qty,
          unitPrice,
          lineTotal,
        };
      })
      .filter((x) => Number.isFinite(x.productId) && x.qty > 0 && x.unitPrice > 0);

    if (items.length === 0) {
      return NextResponse.json({ message: "Sepet boş" }, { status: 400 });
    }

    const subtotal = clampMoney(items.reduce((sum, item) => sum + item.lineTotal, 0));
    const shipping = subtotal >= 1000 ? 0 : 49;
    const total = clampMoney(subtotal + shipping);

    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        total_amount: new Prisma.Decimal(total),
        note: payload.note?.trim() ? payload.note.trim().slice(0, 500) : null,
        meta: {
          shipping,
          address: {
            phone: user.phone,
            first_name: user.first_name,
            last_name: user.last_name,
            address_line1: user.address_line1,
            address_line2: user.address_line2,
            city: user.city,
            district: user.district,
            postal_code: user.postal_code,
            country: user.country,
          },
        },
        items: {
          create: items.map((item) => ({
            product_id: item.productId,
            title: item.title,
            image_url: item.img || null,
            unit_price: new Prisma.Decimal(item.unitPrice),
            quantity: item.qty,
            line_total: new Prisma.Decimal(item.lineTotal),
          })),
        },
      },
      select: { id: true, status: true, total_amount: true, created_at: true },
    });

    return NextResponse.json({
      ok: true,
      order: { id: order.id, status: order.status, total: Number(order.total_amount), created_at: order.created_at },
    });
  } catch (err) {
    if (String(err).includes("UNAUTHORIZED")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 400 });
  }
}
