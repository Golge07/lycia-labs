import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const tokenValue =
    request.cookies.get("token")?.value ||
    request.headers.get("auth_token") ||
    request.headers.get("token");

  if (tokenValue) {
    const [id] = tokenValue.split("|");
    if (id) {
      await prisma.authToken.deleteMany({ where: { id } }).catch(() => {});
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
