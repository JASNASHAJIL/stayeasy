import { useState, useEffect, useContext } from "react";
import socket from "../socket/socket";
import { StayContext } from "../context/StayContext";

export default function ServerOfflineBanner() {
  const [isSocketOffline, setIsSocketOffline] = useState(false);
  const [isRetryHovered, setIsRetryHovered] = useState(false);
  const { error } = useContext(StayContext);

  useEffect(() => {
    const onConnectError = () => setIsSocketOffline(true);
    const onConnect = () => setIsSocketOffline(false);

    socket.on("connect_error", onConnectError);
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect_error", onConnectError);
      socket.off("connect", onConnect);
    };
  }, []);

  // Show banner if Socket is failing OR API (StayContext) reports network error
  const isOffline = isSocketOffline || (error && error.includes("Network error"));

  if (!isOffline) return null;

  return (
    <div style={styles.banner}>
      <span>⚠️ <strong>Server Offline</strong>: Cannot connect to backend on port 5000.</span>
      <button
        style={{ ...styles.retry, ...(isRetryHovered && styles.retryHover) }}
        onClick={() => window.location.reload()}
        onMouseEnter={() => setIsRetryHovered(true)}
        onMouseLeave={() => setIsRetryHovered(false)}
      >
        Retry Connection
      </button>
    </div>
  );
}

const styles = {
  banner: {
    background: "#ef4444",
    color: "white",
    textAlign: "center",
    padding: "12px",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    zIndex: "10000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    fontSize: "14px",
  },
  retry: {
    background: "#c53030",
    color: "white",
    border: "1px solid white",
    padding: "5px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s ease-in-out",
  },
  retryHover: {
    background: "#9b2c2c",
  }
};