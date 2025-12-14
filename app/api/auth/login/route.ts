import { prisma } from "@/lib/prisma";
import { checkHash, generateHash } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const ok = await checkHash(user.password, password);
  if (!ok) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }

  const [hash, unhashed] = await generateHash();
  const token = await prisma.authToken.create({
    data: {
      user_id: user.id,
      hash,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 7),
    },
  });

  const response = NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, role: user.role },
  });

  response.cookies.set("token", `${token.id}|${unhashed}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 7,
  });

  return response;
}

