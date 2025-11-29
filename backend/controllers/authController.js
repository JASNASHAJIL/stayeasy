const User = require("../models/User");
const Owner = require("../models/Owner");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ================= REGISTER =================
exports.registerController = async (req, res) => {
  try {
    const { username, name, phone, password, role } = req.body;
    if (!username || !name || !phone || !password || !role)
      return res.status(400).json({ success: false, message: "All fields are required" });

    let Model = role === "owner" ? Owner : User;

    const existing = await Model.findOne({ $or: [{ username }, { phone }] });
    if (existing) return res.status(400).json({ success: false, message: "Username or phone already exists" });

    const user = new Model({ username, name, phone, password });
    await user.save();

    res.status(201).json({ success: true, message: `${role} registered successfully`, user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= LOGIN =================
exports.loginController = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role)
      return res.status(400).json({ success: false, message: "All fields are required" });

    let Model = role === "owner" ? Owner : role === "admin" ? Admin : User;
    const user = await Model.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPasswordController = async (req, res) => {
  try {
    const { phone, role } = req.body;
    if (!phone || !role) return res.status(400).json({ success: false, message: "Phone and role required" });

    let Model = role === "owner" ? Owner : role === "admin" ? Admin : User;
    const user = await Model.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: "Phone not registered" });

    const otp = generateOtp();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.resetOtp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send OTP via Fast2SMS
    try {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        { message: `Your OTP for StayEase is ${otp}`, route: "q", numbers: phone },
        { headers: { Authorization: process.env.FAST2SMS_API_KEY, "Content-Type": "application/json" } }
      );

      res.json({ success: true, message: "OTP sent to phone" });
    } catch (smsError) {
      console.error("SMS Error:", smsError.response?.data || smsError.message);
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  } catch (err) {
    console.error("Forgot Password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================= VERIFY OTP & RESET PASSWORD =================
exports.verifyOtpController = async (req, res) => {
  try {
    const { phone, otp, newPassword, role } = req.body;
    if (!phone || !otp || !newPassword || !role)
      return res.status(400).json({ success: false, message: "All fields required" });

    let Model = role === "owner" ? Owner : role === "admin" ? Admin : User;
    const user = await Model.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ success: false, message: "OTP expired" });

    user.password = newPassword;
    user.resetOtp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
