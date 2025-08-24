

export type SupplyChainStatus = 'At Manufacturer' | 'In Transit' | 'At Pharmacy';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type OrderItem = {
    medicineId: string;
    name: string;
    quantity: number;
    price: number;
};

export type Order = {
    id: string;
    customerName: string; // Simulated customer name
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    orderDate: string; // ISO date string
};


export type Medicine = {
  id: string; // Firestore document ID
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

export type NewMedicine = Omit<Medicine, "id" | "onChain" | "history" | "supplyChainStatus" | "stock" >;

export type UpdateMedicine = Partial<Omit<Medicine, "id" | "onChain" | "history" | "stock" >>;

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};
