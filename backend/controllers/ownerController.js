const Stay = require("../models/Stay");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ---------------- MULTER CONFIG ----------------
const uploadFolder = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

exports.uploadMiddleware = multer({ storage }).array("images", 5);

// ------------------ ADD STAY ------------------
exports.addStay = async (req, res) => {
  console.log("Files:", req.files);
  console.log("Body:", req.body);
  console.log("User:", req.user);
  try {
    const { title, type, rent, address, lat, lng } = req.body;

    if (!title || !type || !rent || !address || !lat || !lng) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // Save local file paths for DB
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const stay = await Stay.create({
      title,
      type,
      rent: Number(rent),
      address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      images: imagePaths,
      ownerId: req.user.id,
      status: "pending", // admin approval
    });

    res.status(201).json({
      success: true,
      message: "Stay added successfully (Pending Admin Approval)",
      stay,
    });
  } catch (err) {
    console.error("Add Stay Error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// ------------------ GET OWNER'S STAYS ------------------
exports.getOwnerStays = async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
