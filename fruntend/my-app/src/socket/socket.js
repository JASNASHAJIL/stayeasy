import { io } from "socket.io-client";

const socket = io("/", {
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  withCredentials: true,
});

// Optional helper (use it OR set socket.auth and socket.connect in context)
export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};

export default socket;
