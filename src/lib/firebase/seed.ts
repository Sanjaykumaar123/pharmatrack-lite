
"use server";

import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import mockData from '../../../MOCK_DATA.json';
import type { Medicine } from '@/types/medicine';

const getStockStatus = (quantity: number): Medicine['stock']['status'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

export async function seedDatabase() {
    const medicinesCollection = collection(db, 'medicines');
    const batch = writeBatch(db);

    mockData.forEach((medicine) => {
        const docRef = doc(medicinesCollection, medicine.id);
        const data = {
            ...medicine,
            stock: {
                quantity: medicine.quantity,
                status: getStockStatus(medicine.quantity),
            }
        }
        delete (data as any).quantity; // remove top-level quantity

        batch.set(docRef, data);
    });

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database: ", error);
        throw new Error("Failed to seed database.");
    }
}
