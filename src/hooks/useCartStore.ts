
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types/medicine';
import { toast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);

        if (existingItem) {
          // If item already exists, just show a notification
          toast({
            title: "Item already in cart",
            description: `${item.name} is already in your cart. You can change the quantity there.`,
          });
        } else {
          // Add new item
          set((state) => ({ items: [...state.items, { ...item, quantity: item.quantity || 1 }] }));
        }
      },
      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          }));
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
