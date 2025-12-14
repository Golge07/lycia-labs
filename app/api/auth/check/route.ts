import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";

export async function GET(request: NextRequest) {
    const user = await getSessionUser(request);

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(user);
}
