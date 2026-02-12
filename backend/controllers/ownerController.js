const Stay = require("../models/Stay");
const Owner = require("../models/Owner");
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

const uploadMiddleware = multer({ storage }).array("images", 10);
const profilePicMiddleware = multer({ storage }).single("profilePic");

// ---------- ADD STAY ----------
const addStay = async (req, res) => {
  try {
    const { title, type, rent, address, gender } = req.body;

    if (!title || !type || !rent || !address || !gender) {
      return res.status(400).json({ message: "All fields required" });
    }

    // MOCK GEOCODING from address.
    // In a real-world app, you would use a geocoding service (like Google Maps Geocoding API or Nominatim)
    // to convert the address string into latitude and longitude.
    const lat = 20.5937 + (Math.random() - 0.5) * 20; // Random lat in/around India
    const lng = 78.9629 + (Math.random() - 0.5) * 20; // Random lng in/around India

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const imagePaths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    const stay = await Stay.create({
      title,
      type,
      gender,
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

// ---------- DELETE STAY ----------
const deleteStay = async (req, res) => {
  try {
    const stay = await Stay.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!stay) return res.status(404).json({ message: "Stay not found or unauthorized" });
    res.json({ success: true, message: "Stay deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- UPDATE STAY ----------
const updateStay = async (req, res) => {
  try {
    const { rent, status } = req.body;
    const stay = await Stay.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { rent, status },
      { new: true }
    );
    if (!stay) return res.status(404).json({ message: "Stay not found or unauthorized" });
    res.json({ success: true, message: "Stay updated successfully", stay });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- UPDATE PROFILE ----------
const updateProfile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const profilePic = `/uploads/${req.file.filename}`;
    const owner = await Owner.findByIdAndUpdate(req.user.id, { profilePic }, { new: true }).select("-password");

    res.json({ success: true, message: "Profile picture updated", owner });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addStay,
  uploadMiddleware,
  profilePicMiddleware,
  getOwnerStays,
  deleteStay,
  updateStay,
  updateProfile,
};
