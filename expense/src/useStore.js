import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const useStore = create(
  persist(
    (set, get) => ({
      currentUserId: null,
      income: null,
      categories: [],
      expenses: [],
      loading: false,
      error: null,
      resetForAddExpenseUI: false,
      resetDate: null,

      setCurrentUserId: (uid) => set({ currentUserId: uid }),

      // Fetch user data - ALWAYS fetch from Firebase when userId changes
      fetchUserData: async (userId) => {
        if (!userId) return;

        set({ loading: true, error: null });
        try {
          const ref = doc(db, "users", userId);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data();
            set({
              income: data.income ?? null,
              categories: data.categories || [],
              expenses: data.expenses || [],
              resetForAddExpenseUI: data.resetForAddExpenseUI || false,
              resetDate: data.resetDate || null,
            });
          } else {
            await setDoc(ref, { 
              income: null, 
              categories: [], 
              expenses: [],
              resetForAddExpenseUI: false,
              resetDate: null,
            });
            set({ 
              income: null, 
              categories: [], 
              expenses: [],
              resetForAddExpenseUI: false,
              resetDate: null,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // Save income (keeps original amount intact)
      setIncome: async (userId, newIncome) => {
        if (!userId) return;
        set({ error: null });
        try {
          const ref = doc(db, "users", userId);
          // Clear the reset flags when new income is added
          await setDoc(ref, { 
            income: newIncome,
            resetForAddExpenseUI: false,
            resetDate: null,
          }, { merge: true });
          set({ 
            income: newIncome,
            resetForAddExpenseUI: false,
            resetDate: null,
          });
        } catch (error) {
          console.error("Error setting income:", error);
          set({ error: error.message });
        }
      },

      // ✅ Reset income only, keep expenses and flag UI to hide totals
      resetIncome: async (userId) => {
        if (!userId) return;

        try {
          const ref = doc(db, "users", userId);
          const resetTimestamp = new Date().toISOString();

          // Reset income and set flags in Firebase
          await setDoc(ref, { 
            income: null,
            resetForAddExpenseUI: true,
            resetDate: resetTimestamp,
          }, { merge: true });

          set({
            income: null,
            expenses: get().expenses,  // keep all old expenses for REPORT
            resetForAddExpenseUI: true,
            resetDate: resetTimestamp,
          });
        } catch (error) {
          console.error("Error resetting income:", error);
          set({ error: error.message });
        }
      },

      // Clears the UI reset flag so AddExpense behaves normally after income is added
      clearExpenseUIReset: async (userId) => {
        if (!userId) return;

        try {
          const resetTimestamp = new Date().toISOString();
          const ref = doc(db, "users", userId);

          // Update Firebase
          await setDoc(
            ref,
            { resetDate: resetTimestamp, resetForAddExpenseUI: false },
            { merge: true }
          );

          // Update local Zustand store
          set({
            resetDate: resetTimestamp,
            resetForAddExpenseUI: false,
          });
        } catch (error) {
          console.error("Error clearing AddExpense UI reset:", error);
          set({ error: error.message });
        }
      },

      // ✅ Add category
      addCategory: async (userId, newCategory) => {
        if (!userId || !newCategory) return;
        set({ error: null });
        try {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            categories: arrayUnion(newCategory),
          });

          // Update local state
          const currentCategories = get().categories || [];
          if (!currentCategories.includes(newCategory)) {
            set({
              categories: [...currentCategories, newCategory],
            });
          }
        } catch (err) {
          console.error("Error updating category, trying to create document:", err);
          try {
            const userRef = doc(db, "users", userId);
            await setDoc(
              userRef,
              { income: get().income || null, categories: [newCategory] },
              { merge: true }
            );

            // Update local state
            const currentCategories = get().categories || [];
            if (!currentCategories.includes(newCategory)) {
              set({
                categories: [...currentCategories, newCategory],
              });
            }
          } catch (error) {
            console.error("Error adding category:", error);
            set({ error: error.message });
          }
        }
      },

      //  Add expense (NO LONGER reduces income amount - just adds to expenses array)
      addExpense: async (userId, expense) => {
        if (!userId || !expense) return;
        set({ error: null });

        try {
          const userRef = doc(db, "users", userId);

          // Just add expense to array, DON'T modify income
          await updateDoc(userRef, {
            expenses: arrayUnion(expense),
          });

          // Update local state
          const currentExpenses = get().expenses || [];
          set({
            expenses: [...currentExpenses, expense],
          });
        } catch (err) {
          console.error("Error adding expense:", err);

          try {
            const userRef = doc(db, "users", userId);
            await setDoc(
              userRef,
              {
                expenses: [expense],
              },
              { merge: true }
            );

            // Update local state
            set({
              expenses: [expense],
            });
          } catch (error) {
            console.error("Error adding expense:", error);
            set({ error: error.message });
          }
        }
      },

      //  Clear error
      clearError: () => set({ error: null }),

      // Logout - clears state AND removes localStorage entries
      logout: () => {
        const currentUserId = get().currentUserId;
        
        // Clear state
        set({
          currentUserId: null,
          income: null,
          categories: [],
          expenses: [],
          loading: false,
          error: null,
          resetForAddExpenseUI: false,
          resetDate: null,
        });

        // Clear ALL localStorage entries
        if (currentUserId) {
          localStorage.removeItem(`expenseease-store-${currentUserId}`);
        }
        localStorage.removeItem("expenseease-store");
        localStorage.removeItem("expenseease-user");
      },
    }),
    {
      name: "expenseease-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        // Don't persist income and categories - always fetch from Firebase
      }),
    }
  )
);

export default useStore;