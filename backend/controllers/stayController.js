const Stay = require("../models/Stay");
const User = require("../models/User");

const getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "approved" });
    res.json({ success: true, stays });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const searchStaysByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const stays = await Stay.find({
      title: { $regex: title, $options: "i" },
    });
    res.json({ success: true, stays });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const contactOwnerController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isSubscribed) {
      return res.status(403).json({ message: "Subscription required" });
    }

    const stay = await Stay.findById(req.params.id).populate(
      "ownerId",
      "name phone"
    );

    res.json({
      ownerName: stay.ownerId.name,
      phone: stay.ownerId.phone,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllStays,
  searchStaysByTitle,
  contactOwnerController,
};
