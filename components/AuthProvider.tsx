"use client";
import useSession from "@/lib/hooks/auth/useSession";
import { serializeUser } from "@/lib/serializeuser";
import { setUser } from "@/lib/slices/auth";
import { useAppSelector } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const session = useSession();
    const router = useRouter();
    const path = usePathname();
    const user = useAppSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (session.loading) return;

        if (!user && session.user) {
            dispatch(setUser(serializeUser(session.user) as any))
        }

        if (session?.user?.role != "OWNER" && path.startsWith("/panel")) {
            router.push("/")
        }
    }, [dispatch, path, router, session.loading, session.user, user]);

    if (session.loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white/85">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#f2105f]/40 bg-[#0a0a0a]/90 px-10 py-8 text-center shadow-[0_15px_45px_rgba(0,0,0,0.55)]">
                    <span className="h-12 w-12 animate-spin rounded-full border-2 border-[#f2105f]/30 border-t-[#f2105f]" />
                    <p className="text-sm font-medium">Oturum hazırlanıyor...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
