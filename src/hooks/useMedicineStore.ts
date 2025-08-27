
"use client";

import { create } from "zustand";
import allMedicines from '../../MOCK_DATA.json';
import type { Medicine, NewMedicine, UpdateMedicine, ListingStatus } from "@/types/medicine";
import { persist, createJSONStorage } from 'zustand/middleware';

const getStockStatus = (quantity: number): Medicine['stockStatus'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

const processedMedicines: Medicine[] = allMedicines.map(med => ({
    ...med,
    stockStatus: getStockStatus(med.quantity),
    listingStatus: 'Approved' as ListingStatus, // All mock data is considered approved
}));

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  error?: string;
  loading: boolean;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
  updateMedicine: (id: string, payload: UpdateMedicine) => Promise<Medicine | null>;
  approveMedicine: (id: string) => Promise<Medicine | null>;
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
          onChain: true,
          listingStatus: 'Pending', // New medicines require approval
          supplyChainStatus: 'At Manufacturer',
          history: [{
              timestamp: new Date().toISOString(),
              action: 'CREATED',
              changes: 'Batch registered by manufacturer. Awaiting admin approval.'
          }],
          stockStatus: getStockStatus(payload.quantity)
        };
        
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
                        onChain: true,
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

        await new Promise(resolve => setTimeout(resolve, 500));

        set({ loading: false });
        return updatedMedicine;
      },
      approveMedicine: async (id: string) => {
        set({ loading: true });
        let approvedMedicine: Medicine | null = null;

        set(state => {
            const newMedicines = state.medicines.map(med => {
                if (med.id === id) {
                    approvedMedicine = {
                        ...med,
                        listingStatus: 'Approved',
                        history: [
                            ...(med.history || []),
                            {
                                timestamp: new Date().toISOString(),
                                action: 'APPROVED',
                                changes: 'Medicine batch approved by Admin. Now visible to customers.'
                            }
                        ]
                    };
                    return approvedMedicine;
                }
                return med;
            });
            return { medicines: newMedicines };
        });

        await new Promise(resolve => setTimeout(resolve, 250));
        set({ loading: false });
        return approvedMedicine;
      }
    }),
    {
      name: 'medicine-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
