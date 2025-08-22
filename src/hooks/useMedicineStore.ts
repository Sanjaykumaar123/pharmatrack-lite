
"use client";

import { create } from 'zustand';
import { allMedicines as initialMedicines } from '@/lib/data';
import type { Medicine } from '@/types';

// ===================================================================================
// BLOCKCHAIN INTEGRATION SIMULATION
// ===================================================================================
// This file acts as a client-side "store" to simulate a backend or blockchain ledger.
// It uses Zustand, a small state management library, to hold the medicine data.
//
// In a real application:
// - This store would not be pre-populated with static data.
// - It would fetch initial data from your blockchain API.
// - The `add`, `update`, and `delete` functions would make API calls to your
//   backend to write transactions to the blockchain, instead of just
//   modifying local state.
//
// This simulation allows the UI to be fully interactive and responsive, providing a
// realistic prototype of how the final application would behave.
// ===================================================================================

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  initialize: () => void;
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, updatedMedicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  isInitialized: false,
  initialize: () => {
    // In a real app, you'd fetch from an API here.
    // We check if it's already initialized to prevent re-populating on every render.
    if (!get().isInitialized) {
        // Simulate fetching data
        set({ medicines: initialMedicines, isInitialized: true });
    }
  },
  addMedicine: (medicine) => {
    set((state) => ({
      medicines: [...state.medicines, medicine],
    }));
  },
  updateMedicine: (id, updatedMedicine) => {
    set((state) => ({
      medicines: state.medicines.map((med) =>
        med.id === id ? { ...med, ...updatedMedicine } : med
      ),
    }));
  },
  deleteMedicine: (id) => {
    set((state) => ({
      medicines: state.medicines.filter((med) => med.id !== id),
    }));
  },
}));

// Auto-initialize the store when the app loads
useMedicineStore.getState().initialize();

    
