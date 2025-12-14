import { requireSessionUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await requireSessionUser(request);
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: { id, user_id: user.id },
      select: {
        id: true,
        status: true,
        total_amount: true,
        created_at: true,
        meta: true,
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

    if (!order) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      created_at: order.created_at,
      total: Number(order.total_amount),
      meta: order.meta,
      items: order.items.map((i) => ({
        id: i.id,
        product_id: i.product_id,
        title: i.title,
        image_url: i.image_url,
        unit_price: Number(i.unit_price),
        quantity: i.quantity,
        line_total: Number(i.line_total),
      })),
    });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
