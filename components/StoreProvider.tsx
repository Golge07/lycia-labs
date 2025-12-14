"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { hydrateCart } from "@/lib/slices/cart";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }

    useEffect(() => {
        const store = storeRef.current;
        if (!store) return;

        try {
            const raw = localStorage.getItem("lycia_cart");
            if (raw) {
                store.dispatch(hydrateCart(JSON.parse(raw)));
            }
        } catch { }

        const unsubscribe = store.subscribe(() => {
            try {
                const state = store.getState() as any;
                localStorage.setItem("lycia_cart", JSON.stringify(state.cart));
            } catch { }
        });

        return unsubscribe;
    }, []);
    return <Provider store={storeRef.current}>{children}</Provider>;
}
