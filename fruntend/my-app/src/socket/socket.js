import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,

  // ✅ more stable than long-polling in many dev setups
  transports: ["websocket"],

  // ✅ retries when backend restarts
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 800,

  // optional (helps if you later use cookies)
  withCredentials: true,
});

// Optional helper (use it OR set socket.auth and socket.connect in context)
export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};

export default socket;
