const Stay = require("../models/Stay");

// ------------------ GET ALL APPROVED STAYS (USER) ------------------
exports.getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json({ success: true, stays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
