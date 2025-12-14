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

                const data = await res.json();
                if (data?.message == "Unauthorized") {
                    setUser(undefined)
                }

                setUser(data);
            } catch (e) {
                setUser(undefined);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []); // <── SADECE 1 KEZ ÇALIŞIR

    return { loading, user };
}
