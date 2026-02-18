const Stay = require("../models/Stay");
const Owner = require("../models/Owner");

// ✅ Cloudinary multer parser (you already created this file)
const { parser } = require("../config/cloudinaryConfig");

// ---------- CLOUDINARY MULTER MIDDLEWARES ----------
const uploadMiddleware = parser.array("images", 10);
const profilePicMiddleware = parser.single("profilePic");

// ---------- ADD STAY ----------
const addStay = async (req, res) => {
  try {
    const { title, type, rent, address, gender, lat, lng } = req.body;

    if (!title || !type || !rent || !address || !gender) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Cloudinary uploaded file URLs
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const imageUrls = req.files.map((file) => file.path); // ✅ Cloudinary URL

    // ✅ Use real lat/lng if frontend sends, otherwise fallback random
    const finalLat =
      lat !== undefined && lat !== null && lat !== ""
        ? Number(lat)
        : 20.5937 + (Math.random() - 0.5) * 20;

    const finalLng =
      lng !== undefined && lng !== null && lng !== ""
        ? Number(lng)
        : 78.9629 + (Math.random() - 0.5) * 20;

    const stay = await Stay.create({
      title,
      type,
      gender,
      rent: Number(rent),
      address,
      lat: finalLat,
      lng: finalLng,
      images: imageUrls, // ✅ stored as Cloudinary URLs
      ownerId: req.user.id,
      status: "pending",
    });

    res.status(201).json({ success: true, stay });
  } catch (err) {
    console.error("addStay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- OWNER STAYS ----------
const getOwnerStays = async (req, res) => {
  try {
    const stays = await Stay.find({ ownerId: req.user.id });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("getOwnerStays error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- DELETE STAY ----------
const deleteStay = async (req, res) => {
  try {
    const stay = await Stay.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });
    if (!stay) return res.status(404).json({ message: "Stay not found or unauthorized" });

    res.json({ success: true, message: "Stay deleted successfully" });
  } catch (err) {
    console.error("deleteStay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- UPDATE STAY ----------
const updateStay = async (req, res) => {
  try {
    const { rent, status } = req.body;

    const stay = await Stay.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { rent: rent !== undefined ? Number(rent) : undefined, status },
      { new: true }
    );

    if (!stay) return res.status(404).json({ message: "Stay not found or unauthorized" });

    res.json({ success: true, message: "Stay updated successfully", stay });
  } catch (err) {
    console.error("updateStay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- UPDATE PROFILE ----------
const updateProfile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    // ✅ Cloudinary URL
    const profilePic = req.file.path;

    const owner = await Owner.findByIdAndUpdate(
      req.user.id,
      { profilePic },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Profile picture updated", owner });
  } catch (err) {
    console.error("updateProfile error:", err);
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
