
"use client";

import { create } from "zustand";
import { getMedicinesFromFirestore, addMedicineToFirestore, updateMedicineInFirestore } from "@/lib/firebase/medicines";
import type { Medicine, NewMedicine, UpdateMedicine, ListingStatus } from "@/types/medicine";

const getStockStatus = (quantity: number): Medicine['stockStatus'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  error?: string;
  loading: boolean;
  fetchMedicines: () => Promise<void>;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
  updateMedicine: (id: string, payload: UpdateMedicine) => Promise<Medicine | null>;
  approveMedicine: (id: string) => Promise<Medicine | null>;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  isInitialized: false,
  error: undefined,
  loading: false,
  fetchMedicines: async () => {
    if (get().isInitialized) return;
    set({ loading: true });
    try {
      const medicines = await getMedicinesFromFirestore();
      set({ medicines, isInitialized: true, loading: false });
    } catch (error) {
      console.error(error);
      set({ error: "Failed to fetch medicines from the database.", loading: false });
    }
  },
  addMedicine: async (payload) => {
    set({ loading: true });
    try {
      const newMedicine = await addMedicineToFirestore(payload);
      set(state => ({
        medicines: [newMedicine, ...state.medicines],
      }));
      return newMedicine;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
        set({ loading: false });
    }
  },
  updateMedicine: async (id: string, payload: UpdateMedicine) => {
    set({ loading: true });
    try {
      const updatedData = await updateMedicineInFirestore(id, payload);
      let updatedMedicine: Medicine | null = null;
      set(state => {
        const newMedicines = state.medicines.map(med => {
          if (med.id === id) {
            updatedMedicine = { ...med, ...updatedData };
            return updatedMedicine;
          }
          return med;
        });
        return { medicines: newMedicines };
      });
      return updatedMedicine;
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        set({ loading: false });
    }
  },
  approveMedicine: async (id: string) => {
    set({ loading: true });
    let approvedMedicine: Medicine | null = null;

    try {
        await updateMedicineInFirestore(id, { listingStatus: 'Approved' });
        
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
        return approvedMedicine;
    } catch(error) {
        console.error(error);
        return null;
    } finally {
      set({ loading: false });
    }
  }
}));

// Initialize the store by fetching data
useMedicineStore.getState().fetchMedicines();
