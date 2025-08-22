export type Medicine = {
  id: string; // app-level id for list rendering
  name: string;
  batchNo: string;
  mfgDate: string; // ISO date
  expDate: string; // ISO date
  quantity: number;
  manufacturer: string;
  onChain: boolean; // whether we’ve confirmed a ledger write
};

export type NewMedicine = Omit<Medicine, "id" | "onChain">;
