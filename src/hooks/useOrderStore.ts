
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderItem, OrderStatus } from '@/types/medicine';
import { toast } from './use-toast';

interface OrderState {
  orders: Order[];
  addOrder: (newOrderData: Omit<Order, 'id' | 'orderDate'>) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (newOrderData) => {
        const newOrder: Order = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          orderDate: new Date().toISOString(),
          ...newOrderData,
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
      },
      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        }));
        toast({
          title: "Order Status Updated",
          description: `Order ${orderId.split('-')[1]} is now ${newStatus}.`,
        });
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
