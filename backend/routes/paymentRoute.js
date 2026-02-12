const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("crypto");
const User = require("../models/User"); // Import User model

router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount, plan } = req.body;

    console.log("Processing payment for:", amount, plan);

    // --- MOCK MODE (For Study/Demo) ---
    // Create a fake order object without calling Razorpay API
    const order = {
      id: `order_mock_${Date.now()}`,
      entity: "order",
      amount: Math.round(amount * 100), // rupees → paise (ensure integer)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
    };
    // ----------------------------------

    res.json({
      success: true,
      order,
      plan,
    });
  } catch (err) {
    console.error("❌ Razorpay Error:", err);
    
    let message = "Server Error";

    if (err.statusCode === 401) {
      message = "Razorpay Authentication Failed. Check Key ID & Secret in backend .env";
    } else if (err.error && err.error.description) {
      message = err.error.description;
    } else if (err.message) {
      message = err.message;
    }

    res.status(500).json({ success: false, message });
  }
});

router.post("/verify", authMiddleware, async (req, res) => {
  try {
    // --- MOCK MODE (For Study/Demo) ---
    // Skip signature verification and directly update the user
    await User.findByIdAndUpdate(req.user.id || req.user._id, { isSubscribed: true });
    
    return res.status(200).json({ message: "Payment verified successfully (Mock)" });
    // ----------------------------------
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
