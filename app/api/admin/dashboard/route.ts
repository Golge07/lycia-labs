import { requireOwner } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@/prisma/generated/client";
import { NextRequest, NextResponse } from "next/server";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(request: NextRequest) {
  try {
    await requireOwner(request);

    const today = startOfToday();

    const [dailyRevenueAgg, totalRevenueAgg, dailyOrders, totalOrders, recentOrders, statusCounts, canceledToday] =
      await Promise.all([
        prisma.order.aggregate({
          where: { created_at: { gte: today }, status: { not: "IPTAL_EDILDI" } },
          _sum: { total_amount: true },
        }),
        prisma.order.aggregate({
          where: { status: { not: "IPTAL_EDILDI" } },
          _sum: { total_amount: true },
        }),
        prisma.order.count({ where: { created_at: { gte: today } } }),
        prisma.order.count(),
        prisma.order.findMany({
          orderBy: { created_at: "desc" },
          take: 6,
          select: {
            id: true,
            created_at: true,
            status: true,
            total_amount: true,
            user: { select: { username: true } },
          },
        }),
        prisma.order.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        prisma.order.count({ where: { created_at: { gte: today }, status: "IPTAL_EDILDI" } }),
      ]);

    const dailyRevenue = Number(dailyRevenueAgg._sum.total_amount ?? new Prisma.Decimal(0));
    const totalRevenue = Number(totalRevenueAgg._sum.total_amount ?? new Prisma.Decimal(0));
    const avgBasket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusTotal = statusCounts.reduce((sum, s) => sum + s._count._all, 0) || 1;
    const distribution = statusCounts
      .map((s) => ({
        status: s.status as OrderStatus,
        count: s._count._all,
        percent: Math.round((s._count._all / statusTotal) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      stats: {
        dailyRevenue,
        totalRevenue,
        dailyOrders,
        totalOrders,
        canceledToday,
        avgBasket,
      },
      distribution,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        created_at: o.created_at,
        status: o.status,
        total: Number(o.total_amount),
        username: o.user?.username ?? null,
      })),
    });
  } catch (err) {
    if (String(err).includes("FORBIDDEN")) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

