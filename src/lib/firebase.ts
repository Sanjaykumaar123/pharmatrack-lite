// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "pharmatrack-lite-vk7ge",
  "appId": "1:908232495810:web:ed15efdee732ae3cb9e15b",
  "storageBucket": "pharmatrack-lite-vk7ge.firebasestorage.app",
  "apiKey": "AIzaSyDMz170_oiTVcrjWLOhcViXKEarFaccDGI",
  "authDomain": "pharmatrack-lite-vk7ge.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "908232495810"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
