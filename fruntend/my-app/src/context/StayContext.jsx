import React, { createContext, useState, useEffect } from "react";

export const StayContext = createContext(null);

export const StayContextProvider = ({ children }) => {
  const [stays, setStays] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user");
      if (!token || !userInfo) return null;
      return { token, ...JSON.parse(userInfo) };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- AUTH ----------
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser({ token, ...user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // ---------- FETCH STAYS ----------
  const fetchStays = async () => {
    if (!user) return; // no user logged in
    setLoading(true);
    setError(null);

    try {
      let url = "http://localhost:5000/api/stay/all"; // default for normal users
      const headers = {};

      if (user.role === "owner" && user.token) {
        url = "http://localhost:5000/api/owner/my-stays"; // owner-only endpoint
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.success) {
        setStays(data.stays);
      } else {
        setError(data.message || "Failed to fetch stays");
      }
    } catch (err) {
      console.error("Fetch stays error:", err);
      setError("Network error while fetching stays");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stays whenever the user changes (login/logout)
  useEffect(() => {
    fetchStays();
  }, [user]);

  // Add a newly created stay to state immediately
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
