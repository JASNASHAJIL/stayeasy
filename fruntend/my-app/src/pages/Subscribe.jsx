import API from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { StayContext } from "../context/StayContext";

export default function Subscribe() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(StayContext);
  const [hover, setHover] = useState({});
  const redirectTo = location.state?.redirectTo || "/";

  const handleMouseEnter = (key) => setHover(p => ({ ...p, [key]: true }));
  const handleMouseLeave = (key) => setHover(p => ({ ...p, [key]: false }));

  const getButtonStyle = (key) => ({ ...styles.button, ...(hover[key] && styles.buttonHover) });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan, amount) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.token) {
      alert("Please login first");
      navigate("/login", { state: { redirectTo: "/subscribe" } });
      return;
    }

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    try {
      const { data } = await API.post(
        "/payment/create-order",
        { plan, amount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // --- MOCK MODE (For Study/Demo) ---
      // Simulate payment without opening Razorpay SDK
      const isConfirmed = window.confirm(`Mock Payment Gateway\n\nPay ₹${amount} for ${plan}?\n\n(Click OK to Simulate Success)`);
      
      if (isConfirmed) {
        try {
          await API.post(
            "/payment/verify",
            { razorpay_payment_id: "mock_pid", razorpay_order_id: data.order.id, razorpay_signature: "mock_sig", plan },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          alert("Subscription Activated 🎉");
          const updatedUser = { ...user, isSubscribed: true };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          if (login) login(updatedUser); // ✅ Update context immediately

          // If the user was trying to start a chat, create the room now
          if (redirectTo.startsWith('/chat/')) {
            const stayId = redirectTo.split('/')[2];
            await API.post("/chat/start", { stayId }, { headers: { Authorization: `Bearer ${user.token}` } });
          }

          navigate(redirectTo, { replace: true });
        } catch (error) {
          console.error(error);
          alert("Payment verification failed. Please contact support.");
        }
      }
      // ----------------------------------
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.response?.data?.message || err.message || "Payment initialization failed");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.header}>Choose Your Subscription Plan</h2>
      <p style={styles.subheader}>
        Unlock premium features and connect with owners instantly
      </p>

      <div style={styles.cardContainer}>
        {/* 1 Month Plan */}
        <div style={styles.card}>
          <h3 style={styles.planTitle}>1 Month</h3>
          <p style={styles.price}>₹199</p>
          <p style={styles.planDesc}>Perfect for trying StayEase</p>
          <button
            style={getButtonStyle('1_month')}
            onClick={() => handleSubscribe("1_month", 199)}
            onMouseEnter={() => handleMouseEnter('1_month')}
            onMouseLeave={() => handleMouseLeave('1_month')}
          >
            Subscribe
          </button>
        </div>

        {/* 6 Months Plan */}
        <div style={styles.card}>
          <h3 style={styles.planTitle}>6 Months</h3>
          <p style={styles.price}>₹799</p>
          <p style={styles.planDesc}>Best value for half-year plan</p>
          <button
            style={getButtonStyle('6_months')}
            onClick={() => handleSubscribe("6_months", 799)}
            onMouseEnter={() => handleMouseEnter('6_months')}
            onMouseLeave={() => handleMouseLeave('6_months')}
          >
            Subscribe
          </button>
        </div>

        {/* 1 Year Plan */}
        <div style={styles.card}>
          <h3 style={styles.planTitle}>1 Year</h3>
          <p style={styles.price}>₹1299</p>
          <p style={styles.planDesc}>Complete access for 12 months</p>
          <button
            style={getButtonStyle('1_year')}
            onClick={() => handleSubscribe("1_year", 1299)}
            onMouseEnter={() => handleMouseEnter('1_year')}
            onMouseLeave={() => handleMouseLeave('1_year')}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
  },
  header: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
    textAlign: "center",
  },
  subheader: {
    fontSize: "16px",
    marginBottom: "32px",
    textAlign: "center",
    color: "#e0e0e0",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    background: "#fff",
    color: "#333",
    borderRadius: "16px",
    width: "250px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  planTitle: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  price: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  planDesc: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    background: "#c53030",
    color: "#fff",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s ease-in-out",
  },
  buttonHover: {
    background: "#9b2c2c",
    transform: "scale(1.05)",
  },
};
