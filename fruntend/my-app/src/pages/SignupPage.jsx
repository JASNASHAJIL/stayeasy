import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api";
import { StayContext } from "../context/StayContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useContext(StayContext);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await API.post("/register", { username, name, phone, password, role });
      alert("Signup successful! Please login now.");
      navigate("/login"); 
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
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
          <h2 style={styles.title}>Create Your Account</h2>
          <p style={styles.subtitle}>Sign up to start using StayEase</p>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Username</label>
          <motion.input
            whileFocus={{ borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)" }}
            style={styles.input}
            placeholder="Choose a unique username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <motion.input
            whileFocus={{ borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)" }}
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Phone</label>
          <motion.input
            whileFocus={{ borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)" }}
            style={styles.input}
            placeholder="Enter your phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <motion.input
            whileFocus={{ borderColor: "#6366f1", boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)" }}
            style={styles.input}
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>I am a...</label>
          <select style={styles.select} value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User (Looking for a stay)</option>
            <option value="owner">Owner (Listing a property)</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#9b2c2c" }}
          whileTap={{ scale: 0.98 }}
          style={styles.button}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
          Already have an account? <Link to="/login" style={{ ...styles.link, color: "#c53030" }}>Login here</Link>
        </div>
      </motion.div>
    </div>
  );
}

/* =================== STYLES =================== */
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
  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    cursor: "pointer",
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
  link: {
    fontSize: "14px",
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
};
