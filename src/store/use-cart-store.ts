import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Meal {
  id: string;
  name: string;
  price: number;
  image: string;
  providerId: string;
  providerName: string;
}

export interface CartItem extends Meal {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (meal: Meal) => void;
  removeItem: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (meal) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === meal.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === meal.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { ...meal, quantity: 1 }] });
        }
      },
      removeItem: (mealId) => {
        set({
          items: get().items.filter((item) => item.id !== mealId),
        });
      },
      updateQuantity: (mealId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(mealId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === mealId ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "foodhub-cart-storage",
    },
  ),
);
