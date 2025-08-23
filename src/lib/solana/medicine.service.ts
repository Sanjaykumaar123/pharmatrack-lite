
"use client";
import { connection } from "./client";
import type { Medicine, NewMedicine, UpdateMedicine, SupplyChainStatus } from "@/types/medicine";

// Mock ledger data (pretend this lives on-chain)
const MOCK_CHAIN: Medicine[] = [
  {
    id: "mdc-001",
    name: "Paracetamol 500mg",
    batchNo: "BATCH-P500-24A",
    mfgDate: "2024-12-10",
    expDate: "2026-12-09",
    manufacturer: "PharmaLite Labs",
    onChain: true,
    description: "A common pain reliever and fever reducer.",
    stock: { quantity: 1200, status: "In Stock" },
    supplyChainStatus: 'At Pharmacy',
    history: [
      { timestamp: "2024-01-01T10:00:00Z", action: "CREATED", changes: "Batch registered on-chain." }
    ]
  },
  {
    id: "mdc-002",
    name: "Amoxicillin 250mg",
    batchNo: "AMX-250-B11",
    mfgDate: "2025-04-02",
    expDate: "2027-04-01",
    manufacturer: "GZX Bio",
    onChain: true,
    description: "An antibiotic used to treat a number of bacterial infections.",
    stock: { quantity: 600, status: "In Stock" },
    supplyChainStatus: 'In Transit',
     history: [
      { timestamp: "2024-01-02T11:00:00Z", action: "CREATED", changes: "Batch registered on-chain." }
    ]
  },
  {
    id: "mdc-003",
    name: "Ibuprofen 200mg",
    batchNo: "IBU-200-C21",
    mfgDate: "2024-10-15",
    expDate: "2026-10-14",
    manufacturer: "MediCorp",
    onChain: true,
    description: "A nonsteroidal anti-inflammatory drug (NSAID).",
    stock: { quantity: 25, status: "Low Stock" },
    supplyChainStatus: 'At Pharmacy',
     history: [
      { timestamp: "2024-01-03T12:00:00Z", action: "CREATED", changes: "Batch registered on-chain." }
    ]
  },
  {
    id: "mdc-004",
    name: "Cetirizine 10mg",
    batchNo: "CET-010-D99",
    mfgDate: "2025-01-20",
    expDate: "2027-01-19",
    manufacturer: "HealthGlobal",
    onChain: true,
    description: "An antihistamine used to relieve allergy symptoms.",
    stock: { quantity: 0, status: "Out of Stock" },
    supplyChainStatus: 'At Pharmacy',
     history: [
      { timestamp: "2024-01-04T14:00:00Z", action: "CREATED", changes: "Batch registered on-chain." }
    ]
  },
    {
    id: "mdc-005",
    name: "Atorvastatin 20mg",
    batchNo: "ATO-020-E45",
    mfgDate: "2024-08-01",
    expDate: "2026-07-31",
    manufacturer: "PharmaLite Labs",
    onChain: true,
    description: "A statin medication used to prevent cardiovascular disease.",
    stock: { quantity: 400, status: "In Stock" },
    supplyChainStatus: 'At Manufacturer',
     history: [
      { timestamp: "2024-01-05T15:00:00Z", action: "CREATED", changes: "Batch registered on-chain." }
    ]
  },
  {
    id: "mdc-006",
    name: "Metformin 500mg",
    batchNo: "MET-500-F18",
    mfgDate: "2025-05-30",
    expDate: "2027-05-29",
    manufacturer: "GZX Bio",
    onChain: true,
    description: "A first-line medication for the treatment of type 2 diabetes.",
    stock: { quantity: 1500, status: "In Stock" },
    supplyChainStatus: 'At Manufacturer',
    history: [
        { timestamp: "2024-01-06T16:00:00Z", action: "CREATED", changes: "Batch registered on-chain." }
    ]
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

  let status: Medicine['stock']['status'] = 'Out of Stock';
    if (input.quantity > 50) {
        status = 'In Stock';
    } else if (input.quantity > 0) {
        status = 'Low Stock';
    }

  const created: Medicine = {
    id: genId(),
    ...input,
    description: input.description ?? "No description provided.",
    onChain: false, // flip to true once a real tx confirms
    stock: {
        quantity: input.quantity,
        status: status
    },
    supplyChainStatus: 'At Manufacturer',
    history: [{
        timestamp: new Date().toISOString(),
        action: 'CREATED',
        changes: 'Batch registered on the ledger.'
    }]
  };

  // Update our mock in-memory ledger
  MOCK_CHAIN.unshift(created);

  // Simulate on-chain confirmation delay
  setTimeout(() => {
    const index = MOCK_CHAIN.findIndex(m => m.id === created.id);
    if(index !== -1) {
        MOCK_CHAIN[index].onChain = true;
    }
  }, 2000);

  return created;
}

/**
 * Simulate updating an existing medicine on the ledger.
 */
export async function updateMedicineOnChain(
  id: string,
  payload: UpdateMedicine
): Promise<Medicine> {
  console.log(`[Simulated] Building Solana tx for updateMedicine: ${id}`, payload);
  await sleep(300);

  const medicineIndex = MOCK_CHAIN.findIndex((m) => m.id === id);
  if (medicineIndex === -1) {
    throw new Error("Medicine not found on the simulated chain.");
  }

  // Update our mock data
  const originalMedicine = MOCK_CHAIN[medicineIndex];
  
  const updatedMedicine: Medicine = {
    ...originalMedicine,
    ...payload,
    history: originalMedicine.history ? [...originalMedicine.history] : [],
  };

  const changes = Object.entries(payload).map(([key, value]) => {
      const originalValue = (originalMedicine as any)[key];
      if(key === 'stock') return null; // stock object is handled separately
      if(originalValue !== value && value !== undefined) {
        return `${key} changed to "${value}"`;
      }
      return null;
  }).filter(Boolean).join(', ');

  if(changes) {
    updatedMedicine.history?.push({
        timestamp: new Date().toISOString(),
        action: 'UPDATED',
        changes: changes
    });
  }


  // If quantity changed, update stock status and log history
  if (payload.quantity !== undefined && payload.quantity !== originalMedicine.stock.quantity) {
    let newStatus: Medicine['stock']['status'] = 'Out of Stock';
    if (payload.quantity > 50) {
      newStatus = 'In Stock';
    } else if (payload.quantity > 0) {
      newStatus = 'Low Stock';
    }
    updatedMedicine.stock = {
      quantity: payload.quantity,
      status: newStatus,
    };
    updatedMedicine.history?.push({
        timestamp: new Date().toISOString(),
        action: 'UPDATED',
        changes: `Quantity changed from ${originalMedicine.stock.quantity} to ${payload.quantity}`
    });
  }

  MOCK_CHAIN[medicineIndex] = updatedMedicine;

  return updatedMedicine;
}
