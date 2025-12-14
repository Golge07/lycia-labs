import { prisma } from "@/lib/prisma";
import { checkHash } from "@/lib/token";
import type { NextRequest } from "next/server";

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  role: "OWNER" | "USER";
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  district: string | null;
  postal_code: string | null;
  country: string | null;
};

function getTokenValue(request: NextRequest) {
  return (
    request.cookies.get("token")?.value ||
    request.headers.get("auth_token") ||
    request.headers.get("token") ||
    ""
  );
}

export async function getSessionUserFromToken(tokenValue: string): Promise<SessionUser | null> {
  if (!tokenValue) return null;

  const [id, unhashedtoken] = tokenValue.split("|");
  if (!id || !unhashedtoken) return null;

  const token = await prisma.authToken.findFirst({ where: { id } }).catch(() => null);
  if (!token) return null;
  if (token.expires_at < new Date()) return null;

  const ok = await checkHash(token.hash, unhashedtoken).catch(() => false);
  if (!ok) return null;

  const user = await prisma.user
    .findFirst({
      where: { id: token.user_id },
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
    })
    .catch(() => null);

  if (!user) return null;
  return user as SessionUser;
}

export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  return getSessionUserFromToken(getTokenValue(request));
}

export async function requireSessionUser(request: NextRequest): Promise<SessionUser> {
  const user = await getSessionUser(request);
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireOwner(request: NextRequest): Promise<SessionUser> {
  const user = await requireSessionUser(request);
  if (user.role !== "OWNER") throw new Error("FORBIDDEN");
  return user;
}
