"use server"

import { cookies } from "next/headers"

export async function useToken(): Promise<string | undefined> {
    const list = await cookies();
    const token = await list.get("token")?.value as string | undefined;
    return token;
}