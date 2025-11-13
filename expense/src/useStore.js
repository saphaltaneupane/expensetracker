// useStore.js
import { create } from "zustand";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

export const useStore = create((set) => ({
  income: 0,
  categories: [],
  loading: false,

  fetchUserData: async (userId) => {
    set({ loading: true });
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        set({
          income: data.income ?? 0,
          categories: data.categories ?? [],
          loading: false,
        });
      } else {
        // If user doc doesn't exist yet, create a minimal doc
        await setDoc(userRef, { income: 0, categories: [] });
        set({ income: 0, categories: [], loading: false });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ loading: false });
    }
  },

  setIncome: async (userId, newIncome) => {
    set({ income: newIncome });
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { income: newIncome });
  },

  // safe addCategory using arrayUnion and then update local state
  addCategory: async (userId, newCategory) => {
    try {
      const userRef = doc(db, "users", userId);
      // update Firestore safely (arrayUnion avoids racing issues)
      await updateDoc(userRef, { categories: arrayUnion(newCategory) });
      // Update local state so components re-render instantly
      set((state) => ({
        categories: state.categories.includes(newCategory)
          ? state.categories
          : [...state.categories, newCategory],
      }));
    } catch (err) {
      // If updateDoc fails because doc doesn't exist, create it
      console.warn("addCategory updateDoc failed, creating doc...", err);
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { income: 0, categories: [newCategory] }, { merge: true });
      set((state) => ({
        categories: state.categories.includes(newCategory)
          ? state.categories
          : [...state.categories, newCategory],
      }));
    }
  },

  addExpense: async (userId, expense) => {
    const userRef = doc(db, "users", userId);
    const expensesRef = collection(userRef, "expenses");

    await addDoc(expensesRef, {
      name: expense.name,
      amount: Number(expense.amount),
      category: expense.category,
      date: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  },
}));

export default useStore;
