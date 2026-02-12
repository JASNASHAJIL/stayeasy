// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

// -------------------- ROUTES --------------------
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const stayRoutes = require("./routes/stayRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/ChatRoute");

// -------------------- SOCKET --------------------
const socketHandler = require("./socket/socket");

// -------------------- DEFAULT ADMIN --------------------
const createDefaultAdmin = require("./CreateAdmin");

// -------------------- INIT APP --------------------
const app = express();
const server = http.createServer(app);

// -------------------- MIDDLEWARES --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS: In same-domain hosting you don't need strict CORS.
// But keep it safe for dev + production.
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    
    credentials: true,
 } )
);

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------- ROUTES --------------------
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/chat", chatRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/stay", stayRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", authRoutes);

// -------------------- FRONTEND SERVE (PRODUCTION) --------------------
// ✅ If your repo structure is:
//   backend/server.js
//   frontend/dist   (Vite build output)
// then this will serve your React app from the same backend domain.
const FRONTEND_DIST_PATH = path.join(__dirname, "../fruntend/my-app/dist");

app.use(express.static(FRONTEND_DIST_PATH));

// React Router fix: always return index.html for non-api routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST_PATH, "index.html"));
});
// -------------------- SOCKET INIT --------------------
// ✅ If frontend is served from same domain, no need origin "*"
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach socket logic
socketHandler(io);

// -------------------- DATABASE & SERVER --------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await createDefaultAdmin();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

startServer();
