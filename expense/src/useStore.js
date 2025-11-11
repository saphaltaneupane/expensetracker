// useStore.js
import { create } from "zustand";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export const useStore = create((set) => ({
  income: 0,
  categories: [],
  loading: false,

  // 🔹 Fetch user data from Firestore
  fetchUserData: async (userId) => {
    set({ loading: true });
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        set({
          income: data.income,
          categories: data.categories || [],
          loading: false,
        });
      } else {
        console.log("No user found!");
        set({ loading: false });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ loading: false });
    }
  },

  // 🔹 Update income both locally and in Firestore
  setIncome: async (userId, newIncome) => {
    set({ income: newIncome });
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { income: newIncome });
  },

  // 🔹 Add category
  addCategory: async (userId, newCategory) => {
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      categories: [...(await (await getDoc(userRef)).data().categories), newCategory],
    });
  },

  // 🔹 Add expense to Firestore
  addExpense: async (userId, expense) => {
    const userRef = doc(db, "users", userId);
    const expensesRef = collection(userRef, "expenses");
    
    await addDoc(expensesRef, {
      name: expense.name,
      amount: Number(expense.amount),
      category: expense.category,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
  },
}));

export default useStore;
