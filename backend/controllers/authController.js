const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const Admin = require("../models/Admin");
const Owner = require("../models/Owner");
const User = require("../models/User");

// ================== REGISTER ==================
exports.registerController = async (req, res) => {
  try {
    const { username, name, phone, password, role } = req.body;

    if (!username || !name || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration not allowed",
      });
    }

    const existingUser =
      (await Admin.findOne({ username })) ||
      (await Owner.findOne({ username })) ||
      (await User.findOne({ username }));

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const Model = role === "owner" ? Owner : User;

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Model.create({
      username: username.toLowerCase().trim(),
      name,
      phone,
      password: hashedPassword,
      role,
      isSubscribed: false,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================== LOGIN ==================
exports.loginController = async (req, res) => {
  try {
    let { username, password } = req.body;
    console.log(username,password)

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    username = username.toLowerCase().trim();

    // Check Admin first
    let user = await Admin.findOne({ username:username });

    // Then Owner or User
    if (!user) {
      user =
        (await Owner.findOne({ username:username })) ||
        (await User.findOne({ username:username }));
    }
    console.log(user)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password,user.password,isMatch)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
   
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: `${user.role} login successful`,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        isSubscribed: user.isSubscribed || false,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================== FORGOT PASSWORD ==================
exports.forgotPasswordController = async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      return res.status(400).json({
        success: false,
        message: "Phone and role required",
      });
    }

    const Model =
      role === "admin" ? Admin : role === "owner" ? Owner : User;

    const user = await Model.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Phone not registered",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // ✅ SAFE SMS SEND
    try {
      await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          message: `Your OTP for StayEase is ${otp}`,
          route: "q",
          numbers: phone,
        },
        {
          headers: {
            Authorization: process.env.FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (smsError) {
      console.error(
        "SMS error:",
        smsError.response?.data || smsError.message
      );
    }

    res.json({
      success: true,
      message: "OTP sent to phone",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================== VERIFY OTP & RESET PASSWORD ==================
exports.verifyOtpController = async (req, res) => {
  try {
    const { phone, otp, newPassword, role } = req.body;

    if (!phone || !otp || !newPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const Model =
      role === "admin" ? Admin : role === "owner" ? Owner : User;

    const user = await Model.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ✅ HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
