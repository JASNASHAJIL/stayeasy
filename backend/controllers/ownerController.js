const Stay = require("../models/Stay");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ---------- MULTER ----------
const uploadFolder = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const uploadMiddleware = multer({ storage }).array("images", 5);

// ---------- ADD STAY ----------
const addStay = async (req, res) => {
  try {
    const { title, type, rent, address, lat, lng } = req.body;

    if (!title || !type || !rent || !address || !lat || !lng) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const imagePaths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    const stay = await Stay.create({
      title,
      type,
      rent,
      address,
      lat,
      lng,
      images: imagePaths,
      ownerId: req.user.id,
    });

    res.status(201).json({ success: true, stay });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- OWNER STAYS ----------
const getOwnerStays = async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id });
    res.json({ success: true, stays });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addStay,
  uploadMiddleware,
  getOwnerStays,
};
