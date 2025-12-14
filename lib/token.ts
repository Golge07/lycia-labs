import crypto from "crypto"
import argon2 from "argon2"

export async function generateHash(): Promise<[string, string]> {
    const str = crypto.randomBytes(32).toString("hex");

    const hash = await argon2.hash(str);
    return [hash, str]
}

export async function checkHash(hash: string, str: string): Promise<boolean> {

    return await argon2.verify(hash, str);
}