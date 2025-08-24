
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { app, db } from '../firebase';

export const auth = getAuth(app);

export type Role = "customer" | "manufacturer" | "admin";

interface SignUpPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// ========================================================
// SIGN UP
// ========================================================
export async function signUpWithEmail({ email, password, firstName, lastName }: SignUpPayload): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // After creating the user, save their role and other info in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      role: 'customer', // Default role for new sign-ups
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error: any) {
    // Provide more user-friendly error messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email address is already in use.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/weak-password':
        throw new Error('The password is too weak. Please choose a stronger password.');
      default:
        throw new Error('An unexpected error occurred during sign up. Please try again.');
    }
  }
}

// ========================================================
// SIGN IN
// ========================================================
export async function signInWithEmail(email: string, password: string, role: Role): Promise<User> {
   let userCredential;
   try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
     // Handle Firebase-specific auth errors first
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      default:
        // This will catch other unexpected Firebase errors
        throw new Error('An unexpected error occurred during login. Please try again.');
    }
  }
    
  const user = userCredential.user;

  // If login was successful, now verify the role from Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // This case is critical. If the user exists in Auth but not Firestore.
    await signOut(auth); // Log them out for security
    throw new Error("Your user account was not found in the database. Please contact support.");
  }
  
  if (userDoc.data().role !== role) {
    // Role doesn't match, sign them out and throw a specific error
    await signOut(auth);
    throw new Error(`You do not have permission to log in as a ${role}.`);
  }

  // If all checks pass, return the user
  return user;
}


// ========================================================
// SIGN OUT
// ========================================================
export async function signOutUser(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw new Error("Failed to sign out.");
    }
}
