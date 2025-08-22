import type { Medicine } from '@/types';

// ===================================================================================
// BLOCKCHAIN INTEGRATION POINT
// ===================================================================================
// This file currently serves as a MOCK DATABASE for the prototype.
// In a real-world application, this static array would be removed.
//
// Instead, the frontend would make API calls to a dedicated blockchain backend service
// to fetch and update the medicine inventory data. The functions to interact with that
// API would live in this 'lib' folder.
//
// For example, you might have functions like:
//
// export async function getMedicinesFromLedger() {
//   const response = await fetch('https://your-blockchain-api.com/medicines');
//   const medicines = await response.json();
//   return medicines;
// }
//
// export async function addMedicineToLedger(newMedicine) {
//   await fetch('https://your-blockchain-api.com/medicines', {
//     method: 'POST',
//     body: JSON.stringify(newMedicine)
//   });
// }
// ===================================================================================


export const allMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol',
    manufacturer: 'Pharma Inc.',
    batchNumber: 'P12345',
    expiryDate: '2025-12-31',
    description: 'A common pain reliever and fever reducer.',
    stock: {
      quantity: 150,
      status: 'In Stock',
    },
  },
  {
    id: '2',
    name: 'Ibuprofen',
    manufacturer: 'MediCorp',
    batchNumber: 'I67890',
    expiryDate: '2026-06-30',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID).',
    stock: {
      quantity: 25,
      status: 'Low Stock',
    },
  },
  {
    id: '3',
    name: 'Amoxicillin',
    manufacturer: 'HealthGlobal',
    batchNumber: 'A11223',
    expiryDate: '2024-11-30',
    description: 'An antibiotic used to treat a number of bacterial infections.',
    stock: {
      quantity: 0,
      status: 'Out of Stock',
    },
  },
  {
    id: '4',
    name: 'Lisinopril',
    manufacturer: 'Pharma Inc.',
    batchNumber: 'L44556',
    expiryDate: '2027-01-15',
    description: 'An ACE inhibitor used to treat high blood pressure and heart failure.',
    stock: {
      quantity: 200,
      status: 'In Stock',
    },
  },
  {
    id: '5',
    name: 'Metformin',
    manufacturer: 'MediCorp',
    batchNumber: 'M77889',
    expiryDate: '2025-08-20',
    description: 'A first-line medication for the treatment of type 2 diabetes.',
    stock: {
      quantity: 75,
      status: 'In Stock',
    },
  },
  {
    id: '6',
    name: 'Atorvastatin',
    manufacturer: 'HealthGlobal',
    batchNumber: 'A99001',
    expiryDate: '2026-03-25',
    description: 'A statin medication used to prevent cardiovascular disease.',
    stock: {
      quantity: 40,
      status: 'Low Stock',
    },
  },
  {
    id: '7',
    name: 'Crocin Advance',
    manufacturer: 'GSK India',
    batchNumber: 'CRA202401',
    expiryDate: '2026-05-31',
    description: 'Contains Paracetamol for faster relief from pain and fever.',
    stock: {
      quantity: 300,
      status: 'In Stock',
    },
  },
  {
    id: '8',
    name: 'Combiflam',
    manufacturer: 'Sanofi India',
    batchNumber: 'COMB451-B',
    expiryDate: '2025-09-30',
    description: 'Combination of Ibuprofen and Paracetamol for pain and inflammation.',
    stock: {
      quantity: 120,
      status: 'In Stock',
    },
  },
  {
    id: '9',
    name: 'Digene Acidity & Gas Relief',
    manufacturer: 'Abbott India',
    batchNumber: 'DIG5523',
    expiryDate: '2025-07-31',
    description: 'An antacid that provides relief from acidity and gas.',
    stock: {
      quantity: 80,
      status: 'In Stock',
    },
  },
  {
    id: '10',
    name: 'Azithral 500',
    manufacturer: 'Alembic Pharmaceuticals',
    batchNumber: 'AZI-9087',
    expiryDate: '2024-10-31',
    description: 'Azithromycin, an antibiotic for bacterial infections.',
    stock: {
      quantity: 15,
      status: 'Low Stock',
    },
  },
  {
    id: '11',
    name: 'Volini Pain Relief Gel',
    manufacturer: 'Sun Pharma',
    batchNumber: 'VOL-G-021',
    expiryDate: '2026-01-31',
    description: 'Topical gel with Diclofenac for targeted pain relief.',
    stock: {
      quantity: 0,
      status: 'Out of Stock',
    },
  },
  {
    id: '12',
    name: 'Cetirizine',
    manufacturer: 'Cipla',
    batchNumber: 'CETZ-C-443',
    expiryDate: '2027-02-28',
    description: 'An antihistamine used to relieve allergy symptoms.',
    stock: {
      quantity: 250,
      status: 'In Stock',
    },
  },
];
