
"use client";
import { connection } from "./client";
import type { Medicine, NewMedicine, UpdateMedicine, SupplyChainStatus } from "@/types/medicine";

// This file is now deprecated for data storage. 
// It is kept for its simulation of blockchain latency.
// Data is now managed in src/lib/firebase/medicines.ts

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Simulate fetching from Solana. We actually touch the network so
 * you can verify connectivity/devnet health, but we return mock data.
 */
export async function getMedicinesFromChain(): Promise<Medicine[]> {
  console.warn("getMedicinesFromChain is using deprecated mock data. Data is now in Firestore.")
  // Network touch – useful in dev to ensure RPC is reachable
  await connection.getLatestBlockhash();
  // Artificial latency to mimic RPC
  await sleep(250);
  return []; // Return empty as data is in firestore
}

/**
 * Simulate writing a new medicine to the ledger.
 * In a real flow you would build and send a Transaction here using web3.js.
 */
export async function addMedicineToChain(input: NewMedicine): Promise<Medicine> {
    throw new Error("addMedicineToChain is deprecated. Use Firestore functions instead.");
}

/**
 * Simulate updating an existing medicine on the ledger.
 */
export async function updateMedicineOnChain(
  id: string,
  payload: UpdateMedicine
): Promise<Medicine> {
  throw new Error("updateMedicineOnChain is deprecated. Use Firestore functions instead.");
}
