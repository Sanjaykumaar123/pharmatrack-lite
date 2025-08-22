
export interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  description: string;
  stock: {
    quantity: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  };
}
