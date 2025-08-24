
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
        throw new Error('An unexpected error occurred. Please try again.');
    }
  }
}

// ========================================================
// SIGN IN
// ========================================================
export async function signInWithEmail(email: string, password: string, role: Role): Promise<User> {
   try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Verify the user's role from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().role === role) {
        return user;
    } else if (userDoc.exists()) {
        // If role doesn't match, sign them out and throw an error
        await signOut(auth);
        throw new Error(`You do not have permission to log in as a ${role}.`);
    } else {
        // This should not happen if signup is working correctly
         await signOut(auth);
        throw new Error("User data not found. Please contact support.");
    }
  } catch (error: any) {
     // Re-throw custom errors from our role check first
    if (error.message.includes('permission') || error.message.includes('User data not found')) {
        throw error;
    }
    
    // Then handle Firebase-specific auth errors
     switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      default:
        throw new Error('An unexpected error occurred. Please try again.');
    }
  }
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
