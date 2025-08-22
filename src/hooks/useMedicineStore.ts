"use client";
import { create } from "zustand";
import type { Medicine, NewMedicine, UpdateMedicine } from "@/types/medicine";
import { getMedicinesFromChain, addMedicineToChain, updateMedicineOnChain } from "@/lib/solana/medicine.service";

interface MedicineState {
  medicines: Medicine[];
  loading: boolean;
  error?: string;
  isInitialized: boolean;

  fetchMedicines: () => Promise<void>;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
  updateMedicine: (id: string, payload: UpdateMedicine) => Promise<Medicine | null>;
  // Local state updates for prototype (would be replaced by on-chain refetches)
  deleteMedicine: (id: string) => void;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  loading: false,
  error: undefined,
  isInitialized: false,

  fetchMedicines: async () => {
    if (get().isInitialized || get().loading) return; // Prevent multiple fetches
    try {
      set({ loading: true, error: undefined });
      const meds = await getMedicinesFromChain();
      set({ medicines: meds, loading: false, isInitialized: true });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to load medicines", loading: false, isInitialized: true });
    }
  },

  addMedicine: async (payload) => {
    try {
      set({ loading: true, error: undefined });
      const created = await addMedicineToChain(payload);
      set((state) => ({ 
        medicines: [created, ...state.medicines], 
        loading: false 
      }));
      return created;
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to add medicine", loading: false });
      return null;
    }
  },

  updateMedicine: async (id, payload) => {
    try {
      set({ loading: true, error: undefined });
      const updated = await updateMedicineOnChain(id, payload);
      set((state) => ({
        medicines: state.medicines.map((med) =>
          med.id === id ? { ...med, ...updated } : med
        ),
        loading: false,
      }));
      return updated;
    } catch (e: any) {
        set({ error: e?.message ?? "Failed to update medicine", loading: false });
        return null;
    }
  },

  // This is for local simulation and would be removed in a real dApp
  deleteMedicine: (id) => {
    set((state) => ({
      medicines: state.medicines.filter((med) => med.id !== id),
    }));
  },
}));
