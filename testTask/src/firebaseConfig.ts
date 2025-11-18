// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe00o8N6XkEUP8pd-D2YvlWhXjDGg7Au4",
  authDomain: "insiders-to-do.firebaseapp.com",
  projectId: "insiders-to-do",
  storageBucket: "insiders-to-do.firebasestorage.app",
  messagingSenderId: "78708759386",
  appId: "1:78708759386:web:7530758a8fe08c8294b163",
  measurementId: "G-VBCKNXCR69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);