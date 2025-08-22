export type Medicine = {
  id: string; // app-level id for list rendering
  name: string;
  batchNo: string;
  mfgDate: string; // ISO date
  expDate: string; // ISO date
  quantity: number;
  manufacturer: string;
  onChain: boolean; // whether we’ve confirmed a ledger write
  description: string;
  stock: {
      quantity: number;
      status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  };
  imageUrl: string;
};

export type NewMedicine = Omit<Medicine, "id" | "onChain" | "description" | "stock" | "imageUrl">;
