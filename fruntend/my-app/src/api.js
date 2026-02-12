import axios from "axios";

// Create an axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});
// Add a request interceptor to include token if it exists
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
