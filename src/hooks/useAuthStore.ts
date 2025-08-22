
"use client";

import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

// This function will run on the client and listen for auth state changes.
onAuthStateChanged(auth, async (user) => {
    useAuthStore.getState().setIsLoading(true);
    if (user) {
        useAuthStore.getState().setUser(user);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                useAuthStore.getState().setRole(userDoc.data().role);
            } else {
                 useAuthStore.getState().setRole(null);
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            useAuthStore.getState().setRole(null);
        }
    } else {
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setRole(null);
    }
    useAuthStore.getState().setIsLoading(false);
});
