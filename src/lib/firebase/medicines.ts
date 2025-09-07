
import { 
    collection, 
    getDocs, 
    addDoc, 
    doc, 
    updateDoc, 
    serverTimestamp,
    query,
    orderBy,
    getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Medicine, NewMedicine, UpdateMedicine } from '@/types/medicine';

const medicinesCollection = collection(db, 'medicines');

// Helper to determine stock status
const getStockStatus = (quantity: number): Medicine['stockStatus'] => {
    if (quantity <= 0) return 'Out of Stock';
    if (quantity <= 50) return 'Low Stock';
    return 'In Stock';
};

const formatMedicineDoc = (doc: any): Medicine => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        stockStatus: getStockStatus(data.quantity)
    } as Medicine;
}


// ========================================================
// READ
// ========================================================
export async function getMedicinesFromFirestore(): Promise<Medicine[]> {
    try {
        const q = query(medicinesCollection, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(formatMedicineDoc);
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
            listingStatus: 'Pending',
            onChain: false,
            createdAt: serverTimestamp(),
            history: [
                {
                    timestamp: new Date().toISOString(),
                    action: 'CREATED',
                    changes: 'Batch registered in the database, awaiting approval.'
                }
            ]
        };

        const docRef = await addDoc(medicinesCollection, docData);

        const newDoc = await getDoc(doc(db, 'medicines', docRef.id));
        
        return formatMedicineDoc(newDoc);

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
        const medicineDocRef = doc(db, 'medicines', id);

        const updatedPayload: Record<string, any> = { ...payload };

        const originalDoc = await getDoc(medicineDocRef);
        if (!originalDoc.exists()) {
            throw new Error("Medicine not found");
        }
        const originalData = originalDoc.data() as Medicine;
        
        const changes = Object.entries(payload).map(([key, value]) => {
            if (value !== undefined && originalData[key as keyof Medicine] !== value) {
                return `${key} changed`;
            }
            return null;
        }).filter(Boolean).join(', ');
        
        if (changes) {
            const existingHistory = originalData.history || [];
            updatedPayload.history = [
                ...existingHistory,
                {
                    timestamp: new Date().toISOString(),
                    action: 'UPDATED',
                    changes: changes
                }
            ];
        }

        await updateDoc(medicineDocRef, updatedPayload);

        const updatedDoc = await getDoc(medicineDocRef);
        
        return formatMedicineDoc(updatedDoc);

    } catch (error) {
        console.error("Error updating medicine in Firestore: ", error);
        throw new Error("Could not update medicine.");
    }
}
