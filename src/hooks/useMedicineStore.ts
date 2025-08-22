
"use client";

import { create } from 'zustand';
import { getMedicinesFromChain, addMedicineToChain } from '@/lib/solana/medicine.service';
import type { Medicine } from '@/types';

// ===================================================================================
// BLOCKCHAIN INTEGRATION SIMULATION
// ===================================================================================
// This file acts as a client-side "store" to simulate a backend or blockchain ledger.
// It uses Zustand, a small state management library, to hold the medicine data.
//
// The key change is that it now fetches its initial state from our new
// `medicine.service.ts`, which is designed to interact with the Solana blockchain.
// The `addMedicine` function now calls our simulated blockchain service as well.
// ===================================================================================

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  initialize: () => Promise<void>;
  addMedicine: (medicine: Medicine) => Promise<void>;
  updateMedicine: (id: string, updatedMedicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  isInitialized: false,
  initialize: async () => {
    // In a real app, this would be an API call. We are now calling our
    // simulated service that talks to the "blockchain".
    if (!get().isInitialized) {
        const medicinesFromChain = await getMedicinesFromChain();
        set({ medicines: medicinesFromChain, isInitialized: true });
    }
  },
  addMedicine: async (medicine) => {
    // This now calls our service to "write to the chain".
    await addMedicineToChain(medicine);
    set((state) => ({
      medicines: [...state.medicines, medicine],
    }));
  },
  updateMedicine: (id, updatedMedicine) => {
    // This part remains client-side for the prototype, but in a real app,
    // this would also be a transaction sent via the service.
    set((state) => ({
      medicines: state.medicines.map((med) =>
        med.id === id ? { ...med, ...updatedMedicine } : med
      ),
    }));
  },
  deleteMedicine: (id) => {
    // This part remains client-side for the prototype.
    set((state) => ({
      medicines: state.medicines.filter((med) => med.id !== id),
    }));
  },
}));

// Auto-initialize the store when the app loads
useMedicineStore.getState().initialize();
