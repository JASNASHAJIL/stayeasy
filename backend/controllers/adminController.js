const User = require("../models/User");
const Owner = require("../models/Owner");
const Stay = require("../models/Stay");
const mongoose = require("mongoose");

// ------------------ GET ALL USERS ------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ GET ALL OWNERS ------------------
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find({role:"owner"}).sort({ createdAt: -1 });
    res.json({ success: true, owners });
  } catch (err) {
    console.error("Get All Owners Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ PENDING STAYS ------------------
exports.getPendingStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("owner", "name username phone"); // Populate owner details for each stay
    res.json({ success: true, stays });
  } catch (err) {
    console.error("Get Pending Stays Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ APPROVE STAY ------------------
exports.approveStay = async (req, res) => {
  const { id } = req.params;
  
  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid stay ID" });
  }

  try {
    const stay = await Stay.findById(id);
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });

    stay.status = "approved";
    stay.approvedAt = new Date();
    await stay.save();

    res.json({ success: true, message: "Stay approved", stay });
  } catch (err) {
    console.error("Approve Stay Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ REJECT STAY ------------------
exports.rejectStay = async (req, res) => {
  const { id } = req.params;
  
  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid stay ID" });
  }

  try {
    const stay = await Stay.findById(id);
    if (!stay) return res.status(404).json({ success: false, message: "Stay not found" });

    stay.status = "rejected";
    stay.rejectedAt = new Date();
    await stay.save();

    res.json({ success: true, message: "Stay rejected", stay });
  } catch (err) {
    console.error("Reject Stay Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
