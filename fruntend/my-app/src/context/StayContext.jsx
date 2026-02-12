import React, { createContext, useState, useEffect } from "react";
import API from "../api";

export const StayContext = createContext(null);

export const StayContextProvider = ({ children }) => {
  const [stays, setStays] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      return JSON.parse(storedUser); // must include token in user object
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- LOGIN ----------
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ---------- LOGOUT ----------
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  // ---------- FETCH STAYS ----------
  const fetchStays = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      let endpoint = "/stay/all";
      const config = {};

      if ((user.role === "owner" || user.role === "admin") && user.token) {
        config.headers = { Authorization: `Bearer ${user.token}` };
        if (user.role === "owner") endpoint = "/owner/my-stays";
      }

      const { data } = await API.get(endpoint, config);

      if (data.success) setStays(data.stays || []);
      else setError(data.message || "Failed to fetch stays");
    } catch (err) {
      console.error("Fetch stays error:", err);
      setError(err.response?.data?.message || "Network error - Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stays whenever user changes
  useEffect(() => {
    fetchStays();
  }, [user]);

  const addStayToState = (stay) => {
    setStays((prev) => [stay, ...prev]);
  };

  return (
    <StayContext.Provider
      value={{
        stays,
        addStayToState,
        user,
        login,
        logout,
        loading,
        error,
        fetchStays,
      }}
    >
      {children}
    </StayContext.Provider>
  );
};
