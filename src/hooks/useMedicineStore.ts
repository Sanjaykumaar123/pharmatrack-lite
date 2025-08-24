
"use client";

import { create } from "zustand";
import allMedicines from '../../MOCK_DATA.json';
import type { Medicine } from "@/types/medicine";

// ===================================================================================
// LOCAL DATA SIMULATION
// ===================================================================================
// This file now acts as a client-side "store" that loads data directly
// from the local MOCK_DATA.json file. This removes the dependency on an external
// database (like Firestore) and allows the prototype to work offline and without
// any special setup.
// ===================================================================================


const getStockStatus = (quantity: number): Medicine['stockStatus'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

// Process the raw data to add the calculated stockStatus
const processedMedicines: Medicine[] = allMedicines.map(med => ({
    ...med,
    stockStatus: getStockStatus(med.quantity)
}));

interface MedicineState {
  medicines: Medicine[];
  isInitialized: boolean;
  error?: string;
  // Note: add, update, delete functions are removed as we are reading from a static file.
}

export const useMedicineStore = create<MedicineState>(() => ({
  medicines: processedMedicines,
  isInitialized: true, // Data is loaded synchronously, so it's always initialized.
  error: undefined,
}));
