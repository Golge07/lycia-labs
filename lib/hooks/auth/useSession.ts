import { useEffect, useState } from "react";
import { User } from "@/prisma/generated/client";

export default function useSession() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/auth/check", {
                    method: "GET",
                });

                if (!res.ok) {
                    setUser(undefined);
                    return;
                }

                const data = await res.json().catch(() => undefined);
                setUser(data);
            } catch (e) {
                setUser(undefined);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return { loading, user };
}
