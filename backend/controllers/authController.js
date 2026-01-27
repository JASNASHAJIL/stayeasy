const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Owner = require("../models/Owner");
const User = require("../models/User");

// ================== REGISTER ==================
exports.registerController = async (req, res) => {
  try {
    const { username, name, phone, password, role } = req.body;

    if (!username || !name || !phone || !password || !role)
      return res.status(400).json({ success: false, message: "All fields are required" });

    let Model = role === "owner" ? Owner : role === "user" ? User : null;
    if (!Model) return res.status(400).json({ success: false, message: "Invalid role" });

    const exists = await Model.findOne({ username });
    if (exists) return res.status(400).json({ success: false, message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Model.create({
      username,
      name,
      phone,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ success: true, message: "Registration successful", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ================== LOGIN ==================
exports.loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: "Username and password required" });

    // 1️⃣ Check Admin first
    let user = await Admin.findOne({ username });

    // 2️⃣ If not admin, check Owner or User
    if (!user) {
      user = await Owner.findOne({ username }) || await User.findOne({ username });
    }

    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    // Sign JWT using role from DB
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
  success: true,
  message: `${user.role} login successful`,
  token,
  user: {
    _id: user._id,
    name: user.name,
    role: user.role,
    isSubscribed: user.isSubscribed || false
  }
});

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
