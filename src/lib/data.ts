import type { Medicine } from '@/types';

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
];
