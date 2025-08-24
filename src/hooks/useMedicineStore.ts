"use client";
import { create } from "zustand";
import type { Medicine, NewMedicine, UpdateMedicine } from "@/types/medicine";
import { 
    getMedicinesFromFirestore, 
    addMedicineToFirestore, 
    updateMedicineInFirestore 
} from "@/lib/firebase/medicines";

interface MedicineState {
  medicines: Medicine[];
  loading: boolean;
  error?: string;
  isInitialized: boolean;

  fetchMedicines: () => Promise<void>;
  addMedicine: (payload: NewMedicine) => Promise<Medicine | null>;
  updateMedicine: (id: string, payload: UpdateMedicine) => Promise<Medicine | null>;
  deleteMedicine: (id: string) => void;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  loading: false,
  error: undefined,
  isInitialized: false,

  fetchMedicines: async () => {
    if (get().loading) return; 
    try {
      set({ loading: true, error: undefined });
      const meds = await getMedicinesFromFirestore();
      set({ medicines: meds, loading: false, isInitialized: true });
    } catch (e: any) {
      console.error("Failed to load medicines from Firestore:", e);
      set({ error: e?.message ?? "Failed to load medicines", loading: false, isInitialized: true });
    }
  },

  addMedicine: async (payload) => {
    try {
      set({ loading: true, error: undefined });
      const created = await addMedicineToFirestore(payload);
      set((state) => ({ 
        medicines: [created, ...state.medicines], 
        loading: false 
      }));
      return created;
    } catch (e: any) {
      console.error("Failed to add medicine to Firestore:", e);
      set({ error: e?.message ?? "Failed to add medicine", loading: false });
      return null;
    }
  },

  updateMedicine: async (id, payload) => {
    try {
      set({ loading: true, error: undefined });
      const updated = await updateMedicineInFirestore(id, payload);
      set((state) => ({
        medicines: state.medicines.map((med) =>
          med.id === id ? { ...med, ...updated } : med
        ),
        loading: false,
      }));
      return updated;
    } catch (e: any) {
        console.error("Failed to update medicine in Firestore:", e);
        set({ error: e?.message ?? "Failed to update medicine", loading: false });
        return null;
    }
  },

  deleteMedicine: (id) => {
    set((state) => ({
      medicines: state.medicines.filter((med) => med.id !== id),
    }));
  },
}));
