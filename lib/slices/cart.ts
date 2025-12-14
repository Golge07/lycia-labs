import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  productId: number;
  title: string;
  img: string;
  unitPrice: number;
  qty: number;
};

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.min(99, Math.floor(qty)));
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartState | undefined>) => {
      if (!action.payload?.items) return;
      state.items = action.payload.items
        .filter((x) => x && typeof x.productId === "number" && typeof x.title === "string")
        .map((x) => ({ ...x, qty: clampQty(x.qty) }));
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, "qty"> & { qty?: number }>) => {
      const qty = clampQty(action.payload.qty ?? 1);
      const existing = state.items.find((x) => x.productId === action.payload.productId);
      if (existing) {
        existing.qty = clampQty(existing.qty + qty);
        existing.title = action.payload.title;
        existing.img = action.payload.img;
        existing.unitPrice = action.payload.unitPrice;
        return;
      }
      state.items.push({
        productId: action.payload.productId,
        title: action.payload.title,
        img: action.payload.img,
        unitPrice: action.payload.unitPrice,
        qty,
      });
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number }>) => {
      state.items = state.items.filter((x) => x.productId !== action.payload.productId);
    },
    setCartQty: (state, action: PayloadAction<{ productId: number; qty: number }>) => {
      const item = state.items.find((x) => x.productId === action.payload.productId);
      if (!item) return;
      item.qty = clampQty(action.payload.qty);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, setCartQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

