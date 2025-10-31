// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKg1jUrB6bzqXymItivpnOEY76_VIiWbs",
  authDomain: "expenseease-b5116.firebaseapp.com",
  projectId: "expenseease-b5116",
  // fixed storageBucket
  storageBucket: "expenseease-b5116.appspot.com",
  messagingSenderId: "214595351631",
  appId: "1:214595351631:web:d2e8a440b8ea750067663a",
  measurementId: "G-C3H37LNK3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;