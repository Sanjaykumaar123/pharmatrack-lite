
"use client";
import { connection } from "./client";
import type { Medicine, NewMedicine, UpdateMedicine, SupplyChainStatus } from "@/types/medicine";

// Mock ledger data (pretend this lives on-chain)
const MOCK_CHAIN: Medicine[] = [
  {
    id: 'mdc-001',
    name: 'Combiflam',
    batchNo: 'CFLM-001',
    mfgDate: '2024-01-10',
    expDate: '2026-01-09',
    manufacturer: 'Sanofi India',
    onChain: true,
    description: 'Pain and fever reducer.',
    stock: { quantity: 1500, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-01-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-002',
    name: 'Crocin Pain Relief',
    batchNo: 'CRCN-002',
    mfgDate: '2024-02-15',
    expDate: '2026-02-14',
    manufacturer: 'GSK India',
    onChain: true,
    description: 'Provides relief from various types of pain.',
    stock: { quantity: 250, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2024-02-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-003',
    name: 'Azithral 500',
    batchNo: 'AZTH-003',
    mfgDate: '2024-03-20',
    expDate: '2026-03-19',
    manufacturer: 'Alembic Pharma',
    onChain: true,
    description: 'Antibiotic for bacterial infections.',
    stock: { quantity: 45, status: 'Low Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-03-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-004',
    name: 'Dolo 650',
    batchNo: 'DOLO-004',
    mfgDate: '2024-04-25',
    expDate: '2026-04-24',
    manufacturer: 'Micro Labs',
    onChain: true,
    description: 'Used for fever and pain.',
    stock: { quantity: 0, status: 'Out of Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-04-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-005',
    name: 'Amlokind-AT',
    batchNo: 'AMLK-005',
    mfgDate: '2024-05-30',
    expDate: '2026-05-29',
    manufacturer: 'Mankind Pharma',
    onChain: true,
    description: 'For high blood pressure.',
    stock: { quantity: 800, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2024-05-30T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-006',
    name: 'Telma 40',
    batchNo: 'TLMA-006',
    mfgDate: '2024-06-05',
    expDate: '2026-06-04',
    manufacturer: 'Glenmark Pharma',
    onChain: true,
    description: 'Antihypertensive medication.',
    stock: { quantity: 600, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2024-06-05T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-007',
    name: 'Meftal-Spas',
    batchNo: 'MFTS-007',
    mfgDate: '2024-07-10',
    expDate: '2026-07-09',
    manufacturer: 'Blue Cross Labs',
    onChain: true,
    description: 'For abdominal pain and cramps.',
    stock: { quantity: 30, status: 'Low Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2024-07-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-008',
    name: 'Allegra 120mg',
    batchNo: 'ALGRA-008',
    mfgDate: '2024-08-15',
    expDate: '2026-08-14',
    manufacturer: 'Sanofi India',
    onChain: true,
    description: 'Antihistamine for allergies.',
    stock: { quantity: 450, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-08-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-009',
    name: 'Atorva 10',
    batchNo: 'ATOR-009',
    mfgDate: '2024-09-20',
    expDate: '2026-09-19',
    manufacturer: 'Zydus Cadila',
    onChain: true,
    description: 'To lower cholesterol.',
    stock: { quantity: 700, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2024-09-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-010',
    name: 'Volini Gel',
    batchNo: 'VOL-010',
    mfgDate: '2024-10-25',
    expDate: '2026-10-24',
    manufacturer: 'Sun Pharma',
    onChain: true,
    description: 'Topical pain relief gel.',
    stock: { quantity: 120, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-10-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-011',
    name: 'Revital H',
    batchNo: 'REV-011',
    mfgDate: '2024-11-01',
    expDate: '2026-10-31',
    manufacturer: 'Sun Pharma',
    onChain: true,
    description: 'Multivitamin and mineral supplement.',
    stock: { quantity: 300, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2024-11-01T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-012',
    name: 'Ecosprin 75',
    batchNo: 'ECOS-012',
    mfgDate: '2024-12-05',
    expDate: '2026-12-04',
    manufacturer: 'USV Pvt Ltd',
    onChain: true,
    description: 'Blood thinner to prevent clots.',
    stock: { quantity: 900, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-12-05T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-013',
    name: 'Genteal Gel',
    batchNo: 'GENT-013',
    mfgDate: '2025-01-10',
    expDate: '2027-01-09',
    manufacturer: 'Novartis India',
    onChain: true,
    description: 'Lubricating eye drops.',
    stock: { quantity: 50, status: 'Low Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-01-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-014',
    name: 'Betadine Ointment',
    batchNo: 'BETA-014',
    mfgDate: '2025-02-15',
    expDate: '2027-02-14',
    manufacturer: 'Win-Medicare',
    onChain: true,
    description: 'Antiseptic for wounds.',
    stock: { quantity: 200, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2025-02-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-015',
    name: 'Cremaffin Plus',
    batchNo: 'CREM-015',
    mfgDate: '2025-03-20',
    expDate: '2027-03-19',
    manufacturer: 'Abbott India',
    onChain: true,
    description: 'Laxative syrup for constipation.',
    stock: { quantity: 150, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2025-03-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-016',
    name: 'Zincovit Tablet',
    batchNo: 'ZINC-016',
    mfgDate: '2025-04-25',
    expDate: '2027-04-24',
    manufacturer: 'Apex Labs',
    onChain: true,
    description: 'Multivitamin with zinc.',
    stock: { quantity: 1000, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-04-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-017',
    name: 'Neurobion Forte',
    batchNo: 'NEUR-017',
    mfgDate: '2025-05-30',
    expDate: '2027-05-29',
    manufacturer: 'Merck Ltd',
    onChain: true,
    description: 'Vitamin B complex supplement.',
    stock: { quantity: 20, status: 'Low Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-05-30T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-018',
    name: 'Clavam 625',
    batchNo: 'CLVM-018',
    mfgDate: '2025-06-05',
    expDate: '2027-06-04',
    manufacturer: 'Alkem Labs',
    onChain: true,
    description: 'Broad-spectrum antibiotic.',
    stock: { quantity: 0, status: 'Out of Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-06-05T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-019',
    name: 'Digene Tablet',
    batchNo: 'DIGE-019',
    mfgDate: '2025-07-10',
    expDate: '2027-07-09',
    manufacturer: 'Abbott India',
    onChain: true,
    description: 'Antacid for acidity and gas.',
    stock: { quantity: 180, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2025-07-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-020',
    name: 'Ornidazole',
    batchNo: 'ORNI-020',
    mfgDate: '2025-08-15',
    expDate: '2027-08-14',
    manufacturer: 'Cadila Pharma',
    onChain: true,
    description: 'For protozoan infections.',
    stock: { quantity: 90, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2025-08-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  // Adding 180 more medicines
  {
    id: 'mdc-021',
    name: 'Ciplox 500',
    batchNo: 'CPLX-021',
    mfgDate: '2024-01-15',
    expDate: '2026-01-14',
    manufacturer: 'Cipla',
    onChain: true,
    description: 'Antibiotic for bacterial infections.',
    stock: { quantity: 300, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-01-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-022',
    name: 'Taxim-O 200',
    batchNo: 'TAXM-022',
    mfgDate: '2024-02-20',
    expDate: '2026-02-19',
    manufacturer: 'Alkem Labs',
    onChain: true,
    description: 'Cephalosporin antibiotic.',
    stock: { quantity: 40, status: 'Low Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-02-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-023',
    name: 'Pan-D Capsule',
    batchNo: 'PAND-023',
    mfgDate: '2024-03-25',
    expDate: '2026-03-24',
    manufacturer: 'Alkem Labs',
    onChain: true,
    description: 'For gastroesophageal reflux disease.',
    stock: { quantity: 600, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2024-03-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-024',
    name: 'Rosuvas 10',
    batchNo: 'ROSV-024',
    mfgDate: '2024-04-01',
    expDate: '2026-03-31',
    manufacturer: 'Sun Pharma',
    onChain: true,
    description: 'Lowers cholesterol and triglycerides.',
    stock: { quantity: 150, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2024-04-01T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-025',
    name: 'Janumet 50/500',
    batchNo: 'JNM-025',
    mfgDate: '2024-05-10',
    expDate: '2026-05-09',
    manufacturer: 'MSD Pharmaceuticals',
    onChain: true,
    description: 'For type 2 diabetes.',
    stock: { quantity: 200, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-05-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-026',
    name: 'Losar-H',
    batchNo: 'LSRH-026',
    mfgDate: '2024-06-15',
    expDate: '2026-06-14',
    manufacturer: 'Unichem Labs',
    onChain: true,
    description: 'For hypertension.',
    stock: { quantity: 10, status: 'Low Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-06-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-027',
    name: 'Shelcal 500',
    batchNo: 'SHLC-027',
    mfgDate: '2024-07-20',
    expDate: '2026-07-19',
    manufacturer: 'Torrent Pharma',
    onChain: true,
    description: 'Calcium and Vitamin D3 supplement.',
    stock: { quantity: 800, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-07-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-028',
    name: 'Glycomet-GP 2',
    batchNo: 'GLYC-028',
    mfgDate: '2024-08-25',
    expDate: '2026-08-24',
    manufacturer: 'USV Pvt Ltd',
    onChain: true,
    description: 'Anti-diabetic medication.',
    stock: { quantity: 0, status: 'Out of Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-08-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-029',
    name: 'Novomix 30',
    batchNo: 'NVMX-029',
    mfgDate: '2024-09-01',
    expDate: '2026-08-31',
    manufacturer: 'Novo Nordisk',
    onChain: true,
    description: 'Insulin for diabetes.',
    stock: { quantity: 5, status: 'Low Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2024-09-01T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-030',
    name: 'Thyronorm 50mcg',
    batchNo: 'THYR-030',
    mfgDate: '2024-10-10',
    expDate: '2026-10-09',
    manufacturer: 'Abbott India',
    onChain: true,
    description: 'For hypothyroidism.',
    stock: { quantity: 1200, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2024-10-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-031',
    name: 'Pantocid DSR',
    batchNo: 'PNTD-031',
    mfgDate: '2024-11-15',
    expDate: '2026-11-14',
    manufacturer: 'Sun Pharma',
    onChain: true,
    description: 'For acidity and heartburn.',
    stock: { quantity: 350, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-11-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-032',
    name: 'Montair-LC',
    batchNo: 'MNTL-032',
    mfgDate: '2024-12-20',
    expDate: '2026-12-19',
    manufacturer: 'Cipla',
    onChain: true,
    description: 'For allergic rhinitis.',
    stock: { quantity: 200, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2024-12-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-033',
    name: 'Spiriva',
    batchNo: 'SPRV-033',
    mfgDate: '2025-01-25',
    expDate: '2027-01-24',
    manufacturer: 'Boehringer Ingelheim',
    onChain: true,
    description: 'For COPD.',
    stock: { quantity: 25, status: 'Low Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2025-01-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-034',
    name: 'Voveran SR',
    batchNo: 'VOV-034',
    mfgDate: '2025-02-01',
    expDate: '2027-01-31',
    manufacturer: 'Novartis India',
    onChain: true,
    description: 'Sustained-release painkiller.',
    stock: { quantity: 180, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-02-01T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-035',
    name: 'Cetzine 10mg',
    batchNo: 'CTZ-035',
    mfgDate: '2025-03-10',
    expDate: '2027-03-09',
    manufacturer: 'Dr. Reddy\'s Labs',
    onChain: true,
    description: 'Antiallergic medication.',
    stock: { quantity: 500, status: 'In Stock' },
    supplyChainStatus: 'In Transit',
    history: [{ timestamp: '2025-03-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-036',
    name: 'Omez D',
    batchNo: 'OMZD-036',
    mfgDate: '2025-04-15',
    expDate: '2027-04-14',
    manufacturer: 'Dr. Reddy\'s Labs',
    onChain: true,
    description: 'For ulcers and acid reflux.',
    stock: { quantity: 300, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-04-15T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-037',
    name: 'Storvas 20',
    batchNo: 'STRV-037',
    mfgDate: '2025-05-20',
    expDate: '2027-05-19',
    manufacturer: 'Sun Pharma',
    onChain: true,
    description: 'Cholesterol-lowering agent.',
    stock: { quantity: 400, status: 'In Stock' },
    supplyChainStatus: 'At Manufacturer',
    history: [{ timestamp: '2025-05-20T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-038',
    name: 'Uprise-D3 60K',
    batchNo: 'UPRD-038',
    mfgDate: '2025-06-25',
    expDate: '2027-06-24',
    manufacturer: 'Alkem Labs',
    onChain: true,
    description: 'Vitamin D3 supplement.',
    stock: { quantity: 250, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-06-25T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-039',
    name: 'Rantac 150',
    batchNo: 'RANT-039',
    mfgDate: '2025-07-01',
    expDate: '2027-06-30',
    manufacturer: 'J. B. Chemicals',
    onChain: true,
    description: 'For stomach acid reduction.',
    stock: { quantity: 0, status: 'Out of Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-07-01T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  {
    id: 'mdc-040',
    name: 'Oflox 200',
    batchNo: 'OFLX-040',
    mfgDate: '2025-08-10',
    expDate: '2027-08-09',
    manufacturer: 'Cipla',
    onChain: true,
    description: 'Fluoroquinolone antibiotic.',
    stock: { quantity: 100, status: 'In Stock' },
    supplyChainStatus: 'At Pharmacy',
    history: [{ timestamp: '2025-08-10T10:00:00Z', action: 'CREATED', changes: 'Batch registered on-chain.' }]
  },
  ...Array.from({ length: 160 }, (_, i) => {
    const id = i + 41;
    const mfg = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const exp = new Date(mfg.getFullYear() + 2, mfg.getMonth(), mfg.getDate());
    const quantity = Math.floor(Math.random() * 1000);
    const status: Medicine['stock']['status'] = quantity === 0 ? 'Out of Stock' : (quantity < 50 ? 'Low Stock' : 'In Stock');
    const scStatus: SupplyChainStatus[] = ['At Manufacturer', 'In Transit', 'At Pharmacy'];
    const manufacturers = ['Sun Pharma', 'Cipla', 'Dr. Reddy\'s Labs', 'Lupin', 'Aurobindo Pharma', 'Cadila Healthcare'];
    const medicineNames = ['Disprin', 'Benadryl', 'Vicks Action 500', 'Moov', 'Iodex', 'Saridon', 'Gelusil', 'Eno', 'Gaviscon'];
    return {
      id: `mdc-${String(id).padStart(3, '0')}`,
      name: `${medicineNames[id % medicineNames.length]} Variant ${id}`,
      batchNo: `BATCH-${id}`,
      mfgDate: mfg.toISOString().split('T')[0],
      expDate: exp.toISOString().split('T')[0],
      manufacturer: manufacturers[id % manufacturers.length],
      onChain: true,
      description: 'A commonly available medicine in India.',
      stock: { quantity, status },
      supplyChainStatus: scStatus[id % scStatus.length],
      history: [{ timestamp: mfg.toISOString(), action: 'CREATED', changes: 'Batch registered on-chain.' }]
    } as Medicine;
  })
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
    name: input.name,
    manufacturer: input.manufacturer,
    batchNo: input.batchNo,
    mfgDate: input.mfgDate,
    expDate: input.expDate,
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
    onChain: false, // Mark as pending confirmation
  };

  const changes = Object.entries(payload).map(([key, value]) => {
      const originalValue = (originalMedicine as any)[key];
      if(key === 'stock' || key === 'onChain') return null; // stock object is handled separately
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
  
    // Simulate on-chain confirmation delay
  setTimeout(() => {
    const index = MOCK_CHAIN.findIndex(m => m.id === updatedMedicine.id);
    if(index !== -1) {
        MOCK_CHAIN[index].onChain = true;
    }
  }, 2000);


  return updatedMedicine;
}
