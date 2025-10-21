import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcuhdGSY9y8tSlFxc2j1zJhMFOu9-mQ5M",
  authDomain: "admin-platforum.firebaseapp.com",
  projectId: "admin-platforum",
  storageBucket: "admin-platforum.firebasestorage.app",
  messagingSenderId: "895590492040",
  appId: "1:895590492040:web:f321227e76357b7095fc3d",
  measurementId: "G-TEB8KYV1QE"
};
// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// İhtiyacımız olan servisleri dışa aktar
export const db = getFirestore(app);
export const auth = getAuth(app);