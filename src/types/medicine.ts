
export type Medicine = {
  id: string; // app-level id for list rendering
  name: string;
  batchNo: string;
  mfgDate: string; // ISO date
  expDate: string; // ISO date
  quantity: number; // Will be nested under 'stock'
  manufacturer: string;
  onChain: boolean; // whether we’ve confirmed a ledger write
  description: string;
  stock: {
      quantity: number;
      status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  };
  imageUrl: string;
  history?: {
      timestamp: string;
      action: 'CREATED' | 'UPDATED';
      changes: string;
  }[];
};

export type NewMedicine = Omit<Medicine, "id" | "onChain" | "stock" | "imageUrl" | "history" | "description"> & {
    description?: string;
    quantity: number;
};

export type UpdateMedicine = Partial<Omit<Medicine, "id" | "onChain" | "history" | "stock">> & {
    quantity: number;
};
