import { prisma } from "@/lib/prisma";
import { checkHash } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const auth_token =
        request.cookies.get("token")?.value ||
        request.headers.get("auth_token") ||
        request.headers.get("token");

    if (!auth_token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const [id, unhashedtoken] = auth_token.split("|");

    if (!id || !unhashedtoken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await prisma.authToken.findFirst({ where: { id } })
    if (!data) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (data.expires_at < new Date()) {
        return NextResponse.json({ message: "Expired Token" }, { status: 401 })
    }

    const check = await checkHash(data.hash, unhashedtoken);

    if (!check) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findFirst({ where: { id: data.user_id } })

    return NextResponse.json(user);
}
