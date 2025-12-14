import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireOwner(request);
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id },
      select: {
        id: true,
        status: true,
        total_amount: true,
        created_at: true,
        meta: true,
        note: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            phone: true,
            first_name: true,
            last_name: true,
            address_line1: true,
            address_line2: true,
            city: true,
            district: true,
            postal_code: true,
            country: true,
          },
        },
        items: {
          orderBy: { created_at: "asc" },
          select: {
            id: true,
            product_id: true,
            title: true,
            image_url: true,
            unit_price: true,
            quantity: true,
            line_total: true,
          },
        },
      },
    });

    if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...order,
      total_amount: Number(order.total_amount),
      items: order.items.map((i) => ({
        ...i,
        unit_price: Number(i.unit_price),
        line_total: Number(i.line_total),
      })),
    });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireOwner(request);
    const { id } = await params;
    const payload = (await request.json().catch(() => ({}))) as { status?: OrderStatus };

    const status = payload.status;
    if (!status) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      select: { id: true, status: true, updated_at: true },
    });

    return NextResponse.json({ ok: true, order: updated });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

