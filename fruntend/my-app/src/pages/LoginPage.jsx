import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { StayContext } from "../context/StayContext.jsx";

export default function LoginPage() {
  const { login } = useContext(StayContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const data = { username: username.trim(), password: password.trim() };
    const res = await API.post("/login", data);
    const { token, user: u } = res.data;

    // Save to localStorage for later API requests
    const userData = {
  token,
  _id: u._id,
  name: u.name,
  role: u.role,
  isSubscribed: u.isSubscribed
};

localStorage.setItem("token",token);
login(userData);


    // Navigate based on role
    setTimeout(() => {
      if (u.role === "admin") navigate("/admin-dashboard");
      else if (u.role === "owner") navigate("/dashboard");
      else navigate("/");
    }, 50);
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};




  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>Login</button>

      <Link to="/forgot-password" style={styles.forgotLink}>
        Forgot Password?
      </Link>
    </div>
  );
}

const styles = {
  container: {
    width: "350px",
    margin: "60px auto",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    background: "#fff",
    textAlign: "center"
  },
  title: { marginBottom: "20px" },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #aaa"
  },
  button: {
    width: "95%",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#4CAF50",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer"
  },
  forgotLink: {
    display: "block",
    marginTop: "15px",
    color: "#007BFF",
    textDecoration: "none",
    fontSize: "14px"
  }
};
