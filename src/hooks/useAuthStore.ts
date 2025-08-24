
"use client";

import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Role } from '@/lib/firebase/auth';

interface AuthUser {
    uid: string;
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: true, // Initially loading until auth state is determined
            setUser: (user) => set({ user, loading: false }),
            clearUser: () => set({ user: null, loading: false }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

// This function listens to Firebase's auth state changes
// and keeps our Zustand store in sync.
onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
        // User is signed in. Fetch their role from Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            useAuthStore.getState().setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                role: userData.role || 'customer', // Default to customer
                firstName: userData.firstName,
                lastName: userData.lastName,
            });
        } else {
             // This case can happen if user doc creation fails during signup.
             // We'll log them in with a default role.
             useAuthStore.getState().setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                role: 'customer',
            });
        }
    } else {
        // User is signed out.
        useAuthStore.getState().clearUser();
    }
});
