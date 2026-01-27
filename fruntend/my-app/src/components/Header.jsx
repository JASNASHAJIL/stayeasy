import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StayContext } from "../context/StayContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(StayContext);

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate("/userpage")}>
        StayEase
      </div>
      <nav style={styles.nav}>
        {!user && (
          <>
            <button style={styles.button} onClick={() => navigate("/login")}>Login</button>
            <button style={styles.button} onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}

        {user && user.role === "owner" && (
          <>
            <button style={styles.button} onClick={() => navigate("/dashboard")}>
              Owner Dashboard
            </button>
            <button style={styles.button} onClick={() => navigate("/add-stay")}>
              Add Stay
            </button>
            <button style={styles.button} onClick={logout}>Logout</button>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <button style={styles.button} onClick={() => navigate("/admin")}>
              Admin Dashboard
            </button>
            <button style={styles.button} onClick={logout}>Logout</button>
          </>
        )}

        {user && user.role === "user" && (
          <>
            <span style={{ marginRight: "10px" }}>Welcome, {user.username}</span>
            <button style={styles.button} onClick={logout}>Logout</button>
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
    padding: "6px 12px", backgroundColor: "#3498db",
    border: "none", borderRadius: "4px", color: "#fff", cursor: "pointer"
  },
};
