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
      loading: false,
      error: null,

      setCurrentUserId: (uid) => set({ currentUserId: uid }),

      // ✅ Fetch user data - ALWAYS fetch from Firebase when userId changes
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
            });
          } else {
            await setDoc(ref, { income: null, categories: [] });
            set({ income: null, categories: [] });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ error: error.message });
        } finally {
          set({ loading: false });
        }
      },

      // ✅ Save income
      setIncome: async (userId, newIncome) => {
        if (!userId) return;
        set({ error: null });
        try {
          const ref = doc(db, "users", userId);
          await setDoc(ref, { income: newIncome }, { merge: true });
          set({ income: newIncome });
        } catch (error) {
          console.error("Error setting income:", error);
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

          set((state) => ({
            categories: state.categories.includes(newCategory)
              ? state.categories
              : [...state.categories, newCategory],
          }));
        } catch (err) {
          console.error("Error updating category, trying to create document:", err);
          try {
            const userRef = doc(db, "users", userId);
            await setDoc(
              userRef,
              { income: get().income || null, categories: [newCategory] },
              { merge: true }
            );

            set((state) => ({
              categories: state.categories.includes(newCategory)
                ? state.categories
                : [...state.categories, newCategory],
            }));
          } catch (error) {
            console.error("Error adding category:", error);
            set({ error: error.message });
          }
        }
      },

      // ✅ Add expense
      addExpense: async (userId, expense) => {
        if (!userId || !expense) return;
        set({ error: null });
        try {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            expenses: arrayUnion(expense),
          });
        } catch (err) {
          console.error("Error adding expense:", err);
          try {
            const userRef = doc(db, "users", userId);
            await setDoc(
              userRef,
              { expenses: [expense] },
              { merge: true }
            );
          } catch (error) {
            console.error("Error adding expense:", error);
            set({ error: error.message });
          }
        }
      },

      // ✅ Clear error
      clearError: () => set({ error: null }),

      // ✅ Logout - clears state AND removes localStorage entries
      logout: () => {
        const currentUserId = get().currentUserId;
        
        // Clear state
        set({
          currentUserId: null,
          income: null,
          categories: [],
          loading: false,
          error: null,
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