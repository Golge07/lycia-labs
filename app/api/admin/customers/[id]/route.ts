import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireOwner(request);
    const { id } = await params;

    const user = await prisma.user.findFirst({
      where: { id, role: "USER" },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        address_line1: true,
        address_line2: true,
        city: true,
        district: true,
        postal_code: true,
        country: true,
        created_at: true,
      },
    });
    if (!user) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { user_id: id },
      orderBy: { created_at: "desc" },
      take: 50,
      select: { id: true, created_at: true, status: true, total_amount: true },
    });

    return NextResponse.json({
      user,
      orders: orders.map((o) => ({ ...o, total_amount: Number(o.total_amount) })),
    });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

