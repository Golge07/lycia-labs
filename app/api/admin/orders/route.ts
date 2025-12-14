import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireOwner(request);
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();

    const orders = await prisma.order.findMany({
      where: q ? { id: { contains: q, mode: "insensitive" } } : undefined,
      orderBy: { created_at: "desc" },
      take: 200,
      select: {
        id: true,
        status: true,
        total_amount: true,
        created_at: true,
        user: { select: { id: true, username: true, email: true, phone: true } },
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
        user: o.user,
      })),
    );
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

