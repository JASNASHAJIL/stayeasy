const Stay = require("../models/Stay");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "approved" });
    res.json({ success: true, stays });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

const searchStays = async (req, res) => {
  try {
    const { title, type, gender, minRent, maxRent, sort } = req.query;
    let query = { status: "approved" };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (type && type !== "all") {
      query.type = type;
    }
    if (gender && gender !== "all") {
      query.gender = gender;
    }
    if (minRent && maxRent) {
      query.rent = { $gte: Number(minRent), $lte: Number(maxRent) };
    } else if (minRent) {
      query.rent = { $gte: Number(minRent) };
    } else if (maxRent) {
      query.rent = { $lte: Number(maxRent) };
    }

    let sortOption = {};
    switch (sort) {
      case "rent-asc":
        sortOption = { rent: 1 };
        break;
      case "rent-desc":
        sortOption = { rent: -1 };
        break;
      case "date-asc":
        sortOption = { createdAt: 1 };
        break;
      case "date-desc":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const stays = await Stay.find(query).sort(sortOption).populate("ownerId", "name");
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
  searchStays,
  contactOwnerController,
};
