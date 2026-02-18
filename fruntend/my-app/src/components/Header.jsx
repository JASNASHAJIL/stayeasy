import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StayContext } from "../context/StayContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(StayContext);

  const [hover, setHover] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ safe mobile detect
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMouseEnter = (key) => setHover((p) => ({ ...p, [key]: true }));
  const handleMouseLeave = (key) => setHover((p) => ({ ...p, [key]: false }));

  const getButtonStyle = (key) => ({
    ...styles.button,
    ...(hover[key] ? styles.buttonHover : {}),
    ...(isMobile ? styles.mobileButton : {}),
  });

  const go = (path) => {
    navigate(path);
    if (isMobile) setMenuOpen(false);
  };

  const doLogout = () => {
    logout?.();
    if (isMobile) setMenuOpen(false);
  };

  const navStyle = useMemo(() => {
    return {
      ...styles.nav,
      ...(isMobile ? styles.mobileNav : {}),
      ...(isMobile && !menuOpen ? { display: "none" } : {}),
    };
  }, [isMobile, menuOpen]);

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => go("/")}>
        StayEase
      </div>

      {isMobile && (
        <button
          type="button"
          style={styles.hamburgerBtn}
          onClick={() => setMenuOpen((p) => !p)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      )}

      <nav style={navStyle}>
        {!user && (
          <>
            <button
              style={getButtonStyle("login")}
              onMouseEnter={() => handleMouseEnter("login")}
              onMouseLeave={() => handleMouseLeave("login")}
              onClick={() => go("/login")}
            >
              Login
            </button>

            <button
              style={getButtonStyle("signup")}
              onMouseEnter={() => handleMouseEnter("signup")}
              onMouseLeave={() => handleMouseLeave("signup")}
              onClick={() => go("/signup")}
            >
              Sign Up
            </button>
          </>
        )}

        {user?.role === "owner" && (
          <>
            <button
              style={getButtonStyle("ownerDashboard")}
              onMouseEnter={() => handleMouseEnter("ownerDashboard")}
              onMouseLeave={() => handleMouseLeave("ownerDashboard")}
              onClick={() => go("/dashboard")}
            >
              Owner Dashboard
            </button>

            <button
              style={getButtonStyle("addStay")}
              onMouseEnter={() => handleMouseEnter("addStay")}
              onMouseLeave={() => handleMouseLeave("addStay")}
              onClick={() => go("/add-stay")}
            >
              Add Stay
            </button>

            <button
              style={getButtonStyle("logoutOwner")}
              onMouseEnter={() => handleMouseEnter("logoutOwner")}
              onMouseLeave={() => handleMouseLeave("logoutOwner")}
              onClick={doLogout}
            >
              Logout
            </button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <button
              style={getButtonStyle("adminDashboard")}
              onMouseEnter={() => handleMouseEnter("adminDashboard")}
              onMouseLeave={() => handleMouseLeave("adminDashboard")}
              onClick={() => go("/admin")}
            >
              Admin Dashboard
            </button>

            <button
              style={getButtonStyle("logoutAdmin")}
              onMouseEnter={() => handleMouseEnter("logoutAdmin")}
              onMouseLeave={() => handleMouseLeave("logoutAdmin")}
              onClick={doLogout}
            >
              Logout
            </button>
          </>
        )}

        {user?.role === "user" && (
          <>
            <span style={styles.welcomeText}>
              Welcome, {user.username}
            </span>

            <button
              style={getButtonStyle("logoutUser")}
              onMouseEnter={() => handleMouseEnter("logoutUser")}
              onMouseLeave={() => handleMouseLeave("logoutUser")}
              onClick={doLogout}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#2c3e50",
    color: "#fff",

    // ✅ KEY FIX — keep header & menu above search bar
    position: "relative",
    zIndex: 2000,
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hamburgerBtn: {
    fontSize: "1.5rem",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
  },

  nav: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  // ✅ mobile dropdown sits above everything
  mobileNav: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#2c3e50",
    padding: "14px",
    gap: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    zIndex: 2100, // higher than actionBar
  },

  welcomeText: {
    marginRight: "10px",
    fontSize: "0.95rem",
  },

  button: {
    padding: "6px 12px",
    backgroundColor: "#c53030",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
    whiteSpace: "nowrap",
  },

  mobileButton: {
    width: "100%",
    textAlign: "center",
    padding: "10px 12px",
  },

  buttonHover: {
    backgroundColor: "#9b2c2c",
  },
};
