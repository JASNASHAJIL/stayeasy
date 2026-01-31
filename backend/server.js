// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");                 // 🆕
const { Server } = require("socket.io");      // 🆕


// -------------------- ROUTES --------------------
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const stayRoutes = require("./routes/stayRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoute");


// -------------------- SOCKET --------------------
const socketHandler = require("./socket/socket"); // 🆕

// -------------------- DEFAULT ADMIN --------------------
const createDefaultAdmin = require("./CreateAdmin");

// -------------------- INIT APP --------------------
const app = express();
const server = http.createServer(app);         // 🆕

// -------------------- SOCKET INIT --------------------
const io = new Server(server, {                // 🆕
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach socket logic
socketHandler(io);                             // 🆕

// -------------------- MIDDLEWARES --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- ROUTES --------------------
app.use("/api/chat", chatRoutes);
app.use("/api", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/stay", stayRoutes);
app.use("/api/admin", adminRoutes);

// -------------------- DATABASE & SERVER --------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await createDefaultAdmin();

    server.listen(PORT, () =>                 // 🆕
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

startServer();
