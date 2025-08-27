
"use client";

import { create } from "zustand";
import allMedicines from '../../MOCK_DATA.json';
import type { Medicine, NewMedicine, UpdateMedicine } from "@/types/medicine";
import { persist, createJSONStorage } from 'zustand/middleware';

const getStockStatus = (quantity: number): Medicine['stockStatus'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

const processedMedicines: Medicine[] = allMedicines.map(med => ({
    ...med,
    stockStatus: getStockStatus(med.quantity)
}));

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  error?: string;
  loading: boolean;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
  updateMedicine: (id: string, payload: UpdateMedicine) => Promise<Medicine | null>;
}

export const useMedicineStore = create<MedicineState>()(
  persist(
    (set, get) => ({
      medicines: processedMedicines,
      isInitialized: true,
      error: undefined,
      loading: false,
      addMedicine: async (payload) => {
        set({ loading: true });
        const newMedicine: Medicine = {
          id: `med-${Date.now()}`,
          ...payload,
          mfgDate: payload.mfgDate,
          expDate: payload.expDate,
          onChain: true, // Medicine is immediately considered confirmed on-chain
          supplyChainStatus: 'At Manufacturer',
          history: [{
              timestamp: new Date().toISOString(),
              action: 'CREATED',
              changes: 'Batch registered and confirmed on ledger.'
          }],
          stockStatus: getStockStatus(payload.quantity)
        };
        
        // Simulate network delay for the blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          medicines: [newMedicine, ...state.medicines],
          loading: false,
        }));
        
        return newMedicine;
      },
      updateMedicine: async (id: string, payload: UpdateMedicine) => {
        set({ loading: true });
        let updatedMedicine: Medicine | null = null;
        
        set(state => {
            const newMedicines = state.medicines.map(med => {
                if (med.id === id) {
                    const changes = Object.entries(payload).map(([key, value]) => {
                        if (value !== undefined && med[key as keyof Medicine] !== value) {
                            return `${key} changed`;
                        }
                        return null;
                    }).filter(Boolean).join(', ');
                    
                    updatedMedicine = {
                        ...med,
                        ...payload,
                        quantity: payload.quantity ?? med.quantity,
                        onChain: true, // Update is immediately considered confirmed
                        stockStatus: getStockStatus(payload.quantity ?? med.quantity),
                         history: [
                            ...(med.history || []),
                            {
                                timestamp: new Date().toISOString(),
                                action: 'UPDATED',
                                changes: changes || 'Updated details and confirmed on ledger.'
                            }
                        ]
                    };
                    return updatedMedicine;
                }
                return med;
            });
            return { medicines: newMedicines };
        });

        // Simulate network delay for the blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 500));

        set({ loading: false });
        return updatedMedicine;
      }
    }),
    {
      name: 'medicine-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
