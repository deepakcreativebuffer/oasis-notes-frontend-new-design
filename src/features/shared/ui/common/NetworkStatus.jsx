import React, { useState, useEffect } from "react";
import { useNetworkStatus } from "@/utils/networkStatus";

export const NetworkStatus = () => {
  const { isOffline } = useNetworkStatus();
  const [showReconnect, setShowReconnect] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setWasOffline(true);
      setShowReconnect(false);
    } else if (wasOffline) {
      // Just transitioned from offline to online
      setShowReconnect(true);
      const timer = setTimeout(() => {
        setShowReconnect(false);
        setWasOffline(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (isOffline) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#dc3545",
          color: "white",
          textAlign: "center",
          padding: "10px",
          zIndex: 99999,
          fontWeight: "bold",
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <span style={{ marginRight: "8px" }}>⚠️</span>
        You are currently offline. Please check your internet connection.
      </div>
    );
  }

  if (showReconnect) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#28a745",
          color: "white",
          textAlign: "center",
          padding: "10px",
          zIndex: 99999,
          fontWeight: "bold",
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        <span style={{ marginRight: "8px" }}>⚡</span>
        Your internet connection was restored!
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
