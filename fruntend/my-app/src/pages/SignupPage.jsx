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

  const handleSignup = async () => {
    try {
      const res = await API.post("/register", { username, name, phone, password, role });
       alert("Signup successful! Please login now.");
       navigate("/login"); 

      
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      {/* Internal CSS */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
        }
        .signup-container {
          max-width: 400px;
          margin: 60px auto;
          padding: 30px;
          background: #ffffff;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          text-align: center;
          transform: translateY(-50px);
          opacity: 0;
          animation: fadeSlideIn 0.6s forwards;
        }
        @keyframes fadeSlideIn {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .signup-container h1 {
          margin-bottom: 25px;
          color: #333;
          font-size: 28px;
          animation: fadeIn 0.8s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .signup-container input,
        .signup-container select {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
          transition: 0.3s all;
        }
        .signup-container input:focus,
        .signup-container select:focus {
          border-color: #6B73FF;
          outline: none;
          box-shadow: 0 0 8px rgba(107, 115, 255, 0.3);
          transform: scale(1.02);
        }
        .signup-container button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #6B73FF;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s all;
        }
        .signup-container button:hover {
          background: #000DFF;
          transform: scale(1.03);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .signup-container p {
          margin-top: 15px;
          font-size: 14px;
          color: #555;
        }
        .signup-container p a {
          color: #6B73FF;
          text-decoration: none;
          transition: 0.3s;
        }
        .signup-container p a:hover {
          text-decoration: underline;
          color: #000DFF;
        }
      `}</style>

      <div className="signup-container">
        <h1>Sign Up</h1>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
          
        </select>
        <button onClick={handleSignup}>Register</button>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </>
  );
}
