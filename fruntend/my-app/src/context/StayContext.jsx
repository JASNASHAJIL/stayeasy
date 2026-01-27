import React, { createContext, useState, useEffect } from "react";

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
  const login = ({ token, name, role, _id }) => {
    // Save everything in one object
    const userData = { token, name, role, _id };
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
      let url = "http://localhost:5000/api/stay/all";
      const headers = {};

      if ((user.role === "owner" || user.role === "admin") && user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
        if (user.role === "owner") url = "http://localhost:5000/api/owner/my-stays";
      }

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.success) setStays(data.stays || []);
      else setError(data.message || "Failed to fetch stays");
    } catch (err) {
      console.error("Fetch stays error:", err);
      setError("Network error while fetching stays");
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
