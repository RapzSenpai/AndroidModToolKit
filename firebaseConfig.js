import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyA6uWHj2WaIImZZNUmogFD2s-fQHJK_1t0",
  authDomain: "androidmodtoolkit-6c298.firebaseapp.com",
  projectId: "androidmodtoolkit-6c298",
  storageBucket: "androidmodtoolkit-6c298.firebasestorage.app",
  messagingSenderId: "223040275128",
  appId: "1:223040275128:web:8d83ed85614ffb3b6b2a4d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)