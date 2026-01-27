// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// -------------------- ROUTES --------------------
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const stayRoutes = require("./routes/stayRoutes");
const adminRoutes = require("./routes/adminRoutes");

// -------------------- DEFAULT ADMIN --------------------
const createDefaultAdmin = require("./CreateAdmin");

// -------------------- INIT APP --------------------
const app = express();

// -------------------- MIDDLEWARES --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- ROUTES --------------------
app.use("/api", authRoutes);         // Login / Register / OTP
app.use("/api/owner", ownerRoutes);       // Owner → Add / Get Stays
app.use("/api/stay", stayRoutes);         // Stays + Admin approval
app.use("/api/admin", adminRoutes);       // Admin panel

// -------------------- DATABASE & SERVER --------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Create default admin if not exists
    await createDefaultAdmin();

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

startServer();
