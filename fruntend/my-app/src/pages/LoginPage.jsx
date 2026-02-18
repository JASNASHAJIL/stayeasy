import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import { StayContext } from "../context/StayContext.jsx";

export default function LoginPage() {
  const { login } = useContext(StayContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await API.post("/login", {
        username: username.trim(),
        password: password.trim(),
      });

      const { token, user: u } = res.data;

      const userData = {
        token,
        _id: u._id,
        name: u.name,
        role: u.role,
        isSubscribed: u.isSubscribed,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      if (redirectTo && !u.isSubscribed) {
  navigate("/subscribe", {
    state: { redirectTo },
    replace: true
  });
  return;
}

      if (redirectTo) navigate(redirectTo, { replace: true });
      else if (u.role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (u.role === "owner") navigate("/dashboard", { replace: true });
      else navigate("/", { replace: true });

    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={styles.card}
      >
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to your StayEase account</p>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <motion.input
            whileFocus={{ borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)" }}
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <motion.input
            whileFocus={{ borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)" }}
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#9b2c2c" }}
          whileTap={{ scale: 0.98 }}
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <div style={styles.linkContainer}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot password?
          </Link>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
          Don't have an account? <Link to="/signup" style={{ ...styles.link, color: "#c53030" }}>Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc", // Slate-50
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "48px 40px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", // Elegant shadow
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "30px",
    fontWeight: "800",
    color: "#1e293b", // Slate-800
    letterSpacing: "-0.025em",
  },
  subtitle: {
    margin: 0,
    fontSize: "16px",
    color: "#64748b", // Slate-500
  },
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155", // Slate-700
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0", // Slate-200
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#c53030",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 4px 6px -1px rgba(197, 48, 48, 0.2)",
  },
  linkContainer: {
    marginTop: "24px",
    textAlign: "center",
  },
  link: {
    fontSize: "14px",
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
};
