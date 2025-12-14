import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireSessionUser(request);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireSessionUser(request);
    const payload = (await request.json().catch(() => ({}))) as Partial<{
      username: string;
      phone: string;
      first_name: string;
      last_name: string;
      address_line1: string;
      address_line2: string;
      city: string;
      district: string;
      postal_code: string;
      country: string;
    }>;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: payload.username?.trim() ? payload.username.trim() : undefined,
        phone: payload.phone?.trim() ? payload.phone.trim() : null,
        first_name: payload.first_name?.trim() ? payload.first_name.trim() : null,
        last_name: payload.last_name?.trim() ? payload.last_name.trim() : null,
        address_line1: payload.address_line1?.trim() ? payload.address_line1.trim() : null,
        address_line2: payload.address_line2?.trim() ? payload.address_line2.trim() : null,
        city: payload.city?.trim() ? payload.city.trim() : null,
        district: payload.district?.trim() ? payload.district.trim() : null,
        postal_code: payload.postal_code?.trim() ? payload.postal_code.trim() : null,
        country: payload.country?.trim() ? payload.country.trim() : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
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
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (String(err).includes("UNAUTHORIZED")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 400 });
  }
}

