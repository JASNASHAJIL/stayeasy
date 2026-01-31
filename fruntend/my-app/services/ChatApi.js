import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/chat"
});

// Automatically attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const startChat = (data) => API.post("/start", data);

export const getRooms = () => API.get("/rooms");

export const getMessages = (roomId) =>
  API.get(`/messages/${roomId}`);

export const sendMessage = (data) =>
  API.post("/send", data);

export const markSeen = (roomId) =>
  API.put(`/seen/${roomId}`);
