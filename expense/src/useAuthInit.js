import { useEffect, useState } from "react";
import { auth } from "./firebase";
import useStore from "./useStore";

function useAuthInit() {
  const [initialized, setInitialized] = useState(false);
  const { setCurrentUserId, fetchUserData, logout } = useStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const uid = user.uid;
          
          // Clear any stale data from previous user
          const previousUserId = useStore.getState().currentUserId;
          if (previousUserId && previousUserId !== uid) {
            logout();
          }
          
          setCurrentUserId(uid);
          
          // ALWAYS fetch fresh data from Firebase on login
          await fetchUserData(uid);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [setCurrentUserId, fetchUserData, logout]);

  return initialized;
}

export default useAuthInit;