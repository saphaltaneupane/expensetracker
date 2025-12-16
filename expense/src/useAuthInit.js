import { useEffect, useState } from "react";
import { auth } from "./firebase";
import useStore from "./useStore";

function useAuthInit() {
  const [initialized, setInitialized] = useState(false);
  const setCurrentUserId = useStore((s) => s.setCurrentUserId);
  const fetchUserData = useStore((s) => s.fetchUserData);
  const logout = useStore((s) => s.logout);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        logout();
        setInitialized(true);
        return;
      }

      const uid = user.uid;

      // 🔥 Clear stale Zustand state safely
      const previousUserId = useStore.getState().currentUserId;
      if (previousUserId && previousUserId !== uid) {
        logout();
      }

      // Set UID first
      setCurrentUserId(uid);

      // ⏳ Delay Firestore access until auth is fully available
      setTimeout(async () => {
        try {
          await fetchUserData(uid);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setInitialized(true);
        }
      }, 0);
    });

    return () => unsubscribe();
  }, []);

  return initialized;
}

export default useAuthInit;
