
export type SupplyChainStatus = 'At Manufacturer' | 'In Transit' | 'At Pharmacy';

export type Medicine = {
  id: string; // app-level id for list rendering
  name: string;
  batchNo: string;
  mfgDate: string; // ISO date
  expDate: string; // ISO date
  manufacturer: string;
  onChain: boolean; // whether we’ve confirmed a ledger write
  description: string;
  price: number;
  stock: {
      quantity: number;
      status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  };
  supplyChainStatus: SupplyChainStatus;
  history?: {
      timestamp: string;
      action: 'CREATED' | 'UPDATED';
      changes: string;
  }[];
};

export type NewMedicine = Omit<Medicine, "id" | "onChain" | "history" | "supplyChainStatus" | "stock"> & {
    quantity: number;
};

export type UpdateMedicine = Partial<Omit<Medicine, "id" | "onChain" | "history" | "stock" >> & {
    quantity: number;
    supplyChainStatus: SupplyChainStatus;
};

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};
