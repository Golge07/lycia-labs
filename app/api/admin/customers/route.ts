import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireOwner(request);
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim();

    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        ...(q
          ? {
              OR: [
                { email: { contains: q, mode: "insensitive" } },
                { username: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: "desc" },
      take: 200,
      select: { id: true, username: true, email: true, created_at: true },
    });

    const orderStats = await prisma.order.groupBy({
      by: ["user_id"],
      _count: { _all: true },
      _max: { created_at: true },
      where: { user_id: { in: users.map((u) => u.id) } },
    });

    const statsByUser = new Map(
      orderStats.map((s) => [s.user_id, { orders: s._count._all, last: s._max.created_at ?? null }]),
    );

    return NextResponse.json(
      users.map((u) => {
        const stats = statsByUser.get(u.id);
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          orders: stats?.orders ?? 0,
          lastOrderAt: stats?.last ?? null,
          created_at: u.created_at,
        };
      }),
    );
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

