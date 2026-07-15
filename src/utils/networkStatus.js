import { useState, useEffect } from "react";

// Global offline state representation (can be read synchronously in non-React files)
let isOfflineGlobal =
  typeof navigator !== "undefined" ? !navigator.onLine : false;
const listeners = new Set();

const updateGlobalStatus = () => {
  if (typeof navigator !== "undefined") {
    isOfflineGlobal = !navigator.onLine;
    listeners.forEach((listener) => listener(isOfflineGlobal));
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("online", updateGlobalStatus);
  window.addEventListener("offline", updateGlobalStatus);
}

export const getGlobalOfflineStatus = () => isOfflineGlobal;

/**
 * Custom hook to subscribe to and get the current network status
 * @returns {Object} { isOffline: boolean, onLine: boolean }
 */
export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(isOfflineGlobal);

  useEffect(() => {
    const handleStatusChange = (status) => {
      setIsOffline(status);
    };
    listeners.add(handleStatusChange);
    // Sync initial state
    setIsOffline(isOfflineGlobal);
    return () => {
      listeners.delete(handleStatusChange);
    };
  }, []);

  return { isOffline, onLine: !isOffline };
};
