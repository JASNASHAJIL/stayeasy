import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StayContext } from "../context/StayContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(StayContext);
  const [hover, setHover] = useState({});

  const handleMouseEnter = (key) => setHover(p => ({ ...p, [key]: true }));
  const handleMouseLeave = (key) => setHover(p => ({ ...p, [key]: false }));

  const getButtonStyle = (key) => ({
    ...styles.button,
    ...(hover[key] && styles.buttonHover)
  });

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate("/userpage")}>
        StayEase
      </div>
      <nav style={styles.nav}>
        {!user && (
          <>
            <button style={getButtonStyle('login')} onMouseEnter={() => handleMouseEnter('login')} onMouseLeave={() => handleMouseLeave('login')} onClick={() => navigate("/login")}>Login</button>
            <button style={getButtonStyle('signup')} onMouseEnter={() => handleMouseEnter('signup')} onMouseLeave={() => handleMouseLeave('signup')} onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}

        {user && user.role === "owner" && (
          <>
            <button style={getButtonStyle('ownerDashboard')} onMouseEnter={() => handleMouseEnter('ownerDashboard')} onMouseLeave={() => handleMouseLeave('ownerDashboard')} onClick={() => navigate("/dashboard")}>
              Owner Dashboard
            </button>
            <button style={getButtonStyle('addStay')} onMouseEnter={() => handleMouseEnter('addStay')} onMouseLeave={() => handleMouseLeave('addStay')} onClick={() => navigate("/add-stay")}>
              Add Stay
            </button>
            <button style={getButtonStyle('logoutOwner')} onMouseEnter={() => handleMouseEnter('logoutOwner')} onMouseLeave={() => handleMouseLeave('logoutOwner')} onClick={logout}>Logout</button>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <button style={getButtonStyle('adminDashboard')} onMouseEnter={() => handleMouseEnter('adminDashboard')} onMouseLeave={() => handleMouseLeave('adminDashboard')} onClick={() => navigate("/admin")}>
              Admin Dashboard
            </button>
            <button style={getButtonStyle('logoutAdmin')} onMouseEnter={() => handleMouseEnter('logoutAdmin')} onMouseLeave={() => handleMouseLeave('logoutAdmin')} onClick={logout}>Logout</button>
          </>
        )}

        {user && user.role === "user" && (
          <>
            <span style={{ marginRight: "10px" }}>Welcome, {user.username}</span>
            <button style={getButtonStyle('logoutUser')} onMouseEnter={() => handleMouseEnter('logoutUser')} onMouseLeave={() => handleMouseLeave('logoutUser')} onClick={logout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 20px", backgroundColor: "#2c3e50", color: "#fff",
  },
  logo: { fontSize: "1.5rem", fontWeight: "bold", cursor: "pointer" },
  nav: { display: "flex", gap: "10px", alignItems: "center" },
  button: {
    padding: "6px 12px",
    backgroundColor: "#c53030",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  },
  buttonHover: {
    backgroundColor: "#9b2c2c",
  },
};
