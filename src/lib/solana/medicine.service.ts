"use client";
import { connection } from "./client";
import type { Medicine, NewMedicine } from "@/types/medicine";

// Mock ledger data (pretend this lives on-chain)
const MOCK_CHAIN: Medicine[] = [
  {
    id: "mdc-001",
    name: "Paracetamol 500mg",
    batchNo: "BATCH-P500-24A",
    mfgDate: "2024-12-10",
    expDate: "2026-12-09",
    quantity: 1200,
    manufacturer: "PharmaLite Labs",
    onChain: true,
  },
  {
    id: "mdc-002",
    name: "Amoxicillin 250mg",
    batchNo: "AMX-250-B11",
    mfgDate: "2025-04-02",
    expDate: "2027-04-01",
    quantity: 600,
    manufacturer: "GZX Bio",
    onChain: true,
  },
  {
    id: "mdc-003",
    name: "Ibuprofen 200mg",
    batchNo: "IBU-200-C21",
    mfgDate: "2024-10-15",
    expDate: "2026-10-14",
    quantity: 850,
    manufacturer: "MediCorp",
    onChain: true,
  },
  {
    id: "mdc-004",
    name: "Cetirizine 10mg",
    batchNo: "CET-010-D99",
    mfgDate: "2025-01-20",
    expDate: "2027-01-19",
    quantity: 2500,
    manufacturer: "HealthGlobal",
    onChain: true,
  },
    {
    id: "mdc-005",
    name: "Atorvastatin 20mg",
    batchNo: "ATO-020-E45",
    mfgDate: "2024-08-01",
    expDate: "2026-07-31",
    quantity: 400,
    manufacturer: "PharmaLite Labs",
    onChain: true,
  },
  {
    id: "mdc-006",
    name: "Metformin 500mg",
    batchNo: "MET-500-F18",
    mfgDate: "2025-05-30",
    expDate: "2027-05-29",
    quantity: 1500,
    manufacturer: "GZX Bio",
    onChain: true,
  },
];

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const genId = () => `mdc-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Simulate fetching from Solana. We actually touch the network so
 * you can verify connectivity/devnet health, but we return mock data.
 */
export async function getMedicinesFromChain(): Promise<Medicine[]> {
  // Network touch – useful in dev to ensure RPC is reachable
  await connection.getLatestBlockhash();
  // Artificial latency to mimic RPC
  await sleep(250);
  return [...MOCK_CHAIN];
}

/**
 * Simulate writing a new medicine to the ledger.
 * In a real flow you would build and send a Transaction here using web3.js.
 */
export async function addMedicineToChain(input: NewMedicine): Promise<Medicine> {
  console.log("[Simulated] Building Solana tx for addMedicine:", input);

  // Pretend we sent a tx and waited for confirmation
  await sleep(400);

  const created: Medicine = {
    id: genId(),
    ...input,
    onChain: false, // flip to true once a real tx confirms
  };

  // Update our mock in-memory ledger
  MOCK_CHAIN.unshift(created);

  return created;
}
