import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const [isLoginHovered, setIsLoginHovered] = useState(false);

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
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your StayEase account</p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            ...(isLoginHovered && styles.buttonHover)
          }}
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={() => setIsLoginHovered(true)}
          onMouseLeave={() => setIsLoginHovered(false)}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/forgot-password" style={styles.link}>
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "380px",
    background: "#fff",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    marginBottom: "6px",
    fontSize: "26px",
    fontWeight: "700",
  },
  subtitle: {
    marginBottom: "22px",
    fontSize: "14px",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
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
    marginTop: "5px",
    transition: "background-color 0.2s ease-in-out",
  },
  buttonHover: {
    background: "#9b2c2c",
  },
  link: {
    display: "block",
    marginTop: "16px",
    fontSize: "14px",
    color: "#667eea",
    textDecoration: "none",
  },
};
