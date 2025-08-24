

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
  id: string;
  name: string;
  manufacturer: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  price: number;
  onChain: boolean;
  description: string;
  supplyChainStatus: SupplyChainStatus;
  history: {
      timestamp: string;
      action: 'CREATED' | 'UPDATED';
      changes: string;
  }[];
  quantity: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};
