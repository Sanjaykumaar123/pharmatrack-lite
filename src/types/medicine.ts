

export type SupplyChainStatus = 'At Manufacturer' | 'In Transit' | 'At Pharmacy';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type ListingStatus = 'Pending' | 'Approved';

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
    shippingAddress: string;
    mobileNumber: string;
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
  listingStatus: ListingStatus;
  history: {
      timestamp: string;
      action: 'CREATED' | 'UPDATED' | 'APPROVED';
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

// Type for creating a new medicine, without the fields that are auto-generated
export type NewMedicine = Omit<Medicine, 'id' | 'onChain' | 'supplyChainStatus' | 'history' | 'stockStatus' | 'mfgDate' | 'expDate' | 'listingStatus'> & {
    mfgDate: string;
    expDate: string;
};

// Type for updating an existing medicine, all fields are optional
export type UpdateMedicine = Partial<Omit<Medicine, 'id' | 'stockStatus' | 'mfgDate' | 'listingStatus'>> & {
    expDate?: string;
};
