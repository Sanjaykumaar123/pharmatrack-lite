"use client";
import { create } from "zustand";
import type { Medicine, NewMedicine } from "@/types/medicine";
import { getMedicinesFromChain, addMedicineToChain } from "@/lib/solana/medicine.service";

interface MedicineState {
  medicines: Medicine[];
  loading: boolean;
  error?: string;

  fetchMedicines: () => Promise<void>;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  loading: false,
  error: undefined,

  fetchMedicines: async () => {
    try {
      set({ loading: true, error: undefined });
      const meds = await getMedicinesFromChain();
      set({ medicines: meds, loading: false });
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to load medicines", loading: false });
    }
  },

  addMedicine: async (payload) => {
    try {
      set({ loading: true, error: undefined });
      const created = await addMedicineToChain(payload);
      set({ medicines: [created, ...get().medicines], loading: false });
      return created;
    } catch (e: any) {
      set({ error: e?.message ?? "Failed to add medicine", loading: false });
      return null;
    }
  },
}));
