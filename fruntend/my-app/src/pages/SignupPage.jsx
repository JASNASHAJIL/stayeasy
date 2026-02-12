import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  const [isSignupHovered, setIsSignupHovered] = useState(false);

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
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Sign up to start using StayEase</p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <select style={styles.select} value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>

        <button
          style={{ ...styles.button, ...(isSignupHovered && styles.buttonHover) }}
          onClick={handleSignup}
          disabled={loading}
          onMouseEnter={() => setIsSignupHovered(true)}
          onMouseLeave={() => setIsSignupHovered(false)}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={styles.footerText}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
}

/* =================== STYLES =================== */
const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",                 // Ensure full width
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "0",                   // Remove extra padding
    margin: "0",                     // Remove default margin
    boxSizing: "border-box",        // Prevent overflow issues
  },
  card: {
    width: "100%",
    maxWidth: "400px",              // Fixed max width
    background: "#ffffff",
    borderRadius: "14px",
    padding: "40px 32px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "28px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "0.3s all",
  },
  select: {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "24px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "0.3s all",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#c53030",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s all",
  },
  buttonHover: {
    background: "#9b2c2c",
  },
  footerText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#555",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    transition: "0.3s",
  },
};
