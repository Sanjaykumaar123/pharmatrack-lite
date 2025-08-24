
import { 
    collection, 
    getDocs, 
    addDoc, 
    doc, 
    updateDoc, 
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Medicine, NewMedicine, UpdateMedicine } from '@/types/medicine';

const medicinesCollection = collection(db, 'medicines');

// Helper to determine stock status
const getStockStatus = (quantity: number): Medicine['stock']['status'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

// ========================================================
// READ
// ========================================================
export async function getMedicinesFromFirestore(): Promise<Medicine[]> {
    try {
        const q = query(medicinesCollection, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure stock object is correctly formed
                stock: {
                    quantity: data.quantity,
                    status: getStockStatus(data.quantity)
                }
            } as Medicine;
        });
    } catch (error) {
        console.error("Error fetching medicines from Firestore: ", error);
        throw new Error("Could not fetch medicines.");
    }
}

// ========================================================
// CREATE
// ========================================================
export async function addMedicineToFirestore(payload: NewMedicine): Promise<Medicine> {
    try {
        const docData = {
            ...payload,
            supplyChainStatus: 'At Manufacturer',
            onChain: false, // Simulating initial off-chain state
            createdAt: serverTimestamp(),
            history: [
                {
                    timestamp: new Date().toISOString(),
                    action: 'CREATED',
                    changes: 'Batch registered in the database.'
                }
            ]
        };

        const docRef = await addDoc(medicinesCollection, docData);

        // Simulate on-chain confirmation delay
        setTimeout(() => {
            const medicineDoc = doc(db, 'medicines', docRef.id);
            updateDoc(medicineDoc, { onChain: true });
        }, 2000);

        return {
            id: docRef.id,
            ...docData,
            mfgDate: payload.mfgDate,
            expDate: payload.expDate,
            stock: {
                quantity: payload.quantity,
                status: getStockStatus(payload.quantity)
            }
        } as Medicine;

    } catch (error) {
        console.error("Error adding medicine to Firestore: ", error);
        throw new Error("Could not add medicine.");
    }
}


// ========================================================
// UPDATE
// ========================================================
export async function updateMedicineInFirestore(id: string, payload: UpdateMedicine): Promise<Partial<Medicine>> {
     try {
        const medicineDoc = doc(db, 'medicines', id);

        const updatedPayload: Record<string, any> = { ...payload };

        // Add a new history entry
        const changes = Object.entries(payload).map(([key, value]) => {
            if(value !== undefined) {
                 return `${key} updated`;
            }
            return null;
        }).filter(Boolean).join(', ');
        
        if (changes) {
            const originalDoc = (await getDocs(query(medicinesCollection))).docs.find(d => d.id === id);
            const originalData = originalDoc?.data();
            const existingHistory = originalData?.history || [];

            updatedPayload.history = [
                ...existingHistory,
                {
                    timestamp: new Date().toISOString(),
                    action: 'UPDATED',
                    changes: changes
                }
            ];
        }


        await updateDoc(medicineDoc, updatedPayload);

        // Simulate on-chain confirmation
        updateDoc(medicineDoc, { onChain: false });
        setTimeout(() => {
            updateDoc(medicineDoc, { onChain: true });
        }, 1500);

        return { 
            ...payload, 
            stock: payload.quantity ? {
                quantity: payload.quantity,
                status: getStockStatus(payload.quantity)
            } : undefined
        };

    } catch (error) {
        console.error("Error updating medicine in Firestore: ", error);
        throw new Error("Could not update medicine.");
    }
}
