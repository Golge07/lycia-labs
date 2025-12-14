import { prisma } from "@/lib/prisma";
import { generateHash } from "@/lib/token";
import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, email, password } = (await request.json().catch(() => ({}))) as {
    username?: string;
    email?: string;
    password?: string;
  };

  if (!username || !email || !password) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: passwordHash,
      verified: true,
      role: "USER",
    },
  });

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

