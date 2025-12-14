"use client";

import useSession from "@/lib/hooks/auth/useSession";
import { setUser } from "@/lib/slices/auth";
import { useAppSelector } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    const router = useRouter();
    const path = usePathname();
    const user = useAppSelector((state) => state.user).user;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            dispatch(setUser(session.user as any));
        }
    }, [dispatch, session.user, user]);

    useEffect(() => {
        if (session.loading) return;
        if (user?.role !== "OWNER" && path.startsWith("/panel")) {
            router.push("/");
        }
    }, [path, user]);

    if (session.loading) {
        return (
            <div className="relative flex w-screen h-screen items-center justify-center bg-background px-6 text-foreground">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-[-15%] top-[-10%] h-72 w-72 rounded-full bg-[rgba(167,68,68,0.08)] blur-3xl" />
                    <div className="absolute right-[-10%] top-10 h-80 w-80 rounded-full bg-[rgba(143,188,163,0.08)] blur-3xl" />
                </div>

                <div
                    role="status"
                    aria-live="polite"
                    className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-foreground/10 bg-white/80 px-10 py-8 text-center shadow-2xl backdrop-blur"
                >
          <span
            aria-hidden="true"
            className="h-12 w-12 animate-spin rounded-full border-2 border-terracotta/30 border-t-terracotta"
          />
          <div className="space-y-1">
            <p className="heading-font text-xl text-foreground">Oturum hazırlanıyor</p>
            <p className="text-sm text-foreground/65">Kısa bir an bekleyin…</p>
          </div>
        </div>
      </div>
    );
  }

    return <>{children}</>;
}
