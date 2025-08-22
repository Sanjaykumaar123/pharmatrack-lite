"use client";
import { useEffect, useState } from "react";
import { useMedicineStore } from "@/hooks/useMedicineStore";
import type { NewMedicine } from "@/types/medicine";

export default function MedicinesPage() {
  const { medicines, loading, error, fetchMedicines, addMedicine } = useMedicineStore();

  const [form, setForm] = useState<NewMedicine>({
    name: "",
    batchNo: "",
    mfgDate: new Date().toISOString().slice(0, 10),
    expDate: new Date(Date.now() + 31536000000).toISOString().slice(0, 10), // +1y
    quantity: 0,
    manufacturer: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.batchNo) return;
    await addMedicine({ ...form, quantity: Number(form.quantity) || 0 });
    setForm((f) => ({ ...f, name: "", batchNo: "", quantity: 0, manufacturer: "", mfgDate: new Date().toISOString().slice(0, 10), expDate: new Date(Date.now() + 31536000000).toISOString().slice(0, 10) }));
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Medicines (devnet simulated)</h1>

      <form onSubmit={onSubmit} className="mb-6 grid grid-cols-2 gap-3">
        <input
          className="border rounded-xl p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded-xl p-2"
          placeholder="Batch No"
          value={form.batchNo}
          onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
        />
        <input
          className="border rounded-xl p-2"
          type="date"
          value={form.mfgDate}
          onChange={(e) => setForm({ ...form, mfgDate: e.target.value })}
        />
        <input
          className="border rounded-xl p-2"
          type="date"
          value={form.expDate}
          onChange={(e) => setForm({ ...form, expDate: e.target.value })}
        />
        <input
          className="border rounded-xl p-2"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />
        <input
          className="border rounded-xl p-2"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
        />
        <button className="col-span-2 bg-black text-white rounded-xl py-2">Add Medicine</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="space-y-3">
        {medicines.map((m) => (
          <li key={m.id} className="border rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-gray-600">Batch: {m.batchNo} • Qty: {m.quantity}</p>
              <p className="text-xs text-gray-500">MFG {m.mfgDate} • EXP {m.expDate} • {m.onChain ? "on-chain" : "pending"}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${m.onChain ? "bg-green-100" : "bg-yellow-100"}`}>
              {m.onChain ? "On-chain" : "Simulated"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
