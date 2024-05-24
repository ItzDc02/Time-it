// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLpA3KOagBcTW2lhxtoEjTt5u3vEvVkL0",
  authDomain: "virtual-time-capsule-3d012.firebaseapp.com",
  projectId: "virtual-time-capsule-3d012",
  storageBucket: "virtual-time-capsule-3d012.appspot.com",
  messagingSenderId: "952231029513",
  appId: "1:952231029513:web:200843e6b638c0fe4981d8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
