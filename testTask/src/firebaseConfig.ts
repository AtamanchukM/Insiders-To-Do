// Firebase v9+ modular SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Скопіюй ці значення з Firebase Console → Project Settings → SDK setup
const firebaseConfig = {
    apiKey: "AIzaSyBJrZeBThRVdKslxLK-F7igkL47iX8qKe8",
    authDomain: "testtask-d95df.firebaseapp.com",
    projectId: "testtask-d95df",
    storageBucket: "testtask-d95df.firebasestorage.app",
    messagingSenderId: "574905008407",
    appId: "1:574905008407:web:4f89b129a758a12e9a3752",
    measurementId: "G-2FXFCGB5F7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
