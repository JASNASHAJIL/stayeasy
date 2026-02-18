const Stay = require("../models/Stay");
const User = require("../models/User");

// ✅ GET ALL APPROVED STAYS
const getAllStays = async (req, res) => {
  try {
    const stays = await Stay.find({ status: "approved" });
    res.json({ success: true, stays });
  } catch (err) {
    console.error("getAllStays error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ SEARCH APPROVED STAYS
const searchStays = async (req, res) => {
  try {
    const { title, type, gender, minRent, maxRent, sort } = req.query;
    let query = { status: "approved" };

    if (title) query.title = { $regex: title, $options: "i" };
    if (type && type !== "all") query.type = type;
    if (gender && gender !== "all") query.gender = gender;

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

    const stays = await Stay.find(query)
      .sort(sortOption)
      .populate("ownerId", "name");

    res.json({ success: true, stays });
  } catch (err) {
    console.error("searchStays error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CONTACT OWNER (subscription check)
const contactOwnerController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.isSubscribed) {
      return res.status(403).json({ message: "Subscription required" });
    }

    const stay = await Stay.findById(req.params.id).populate("ownerId", "name phone");

    if (!stay || !stay.ownerId) {
      return res.status(404).json({ message: "Stay/Owner not found" });
    }

    res.json({
      ownerName: stay.ownerId.name,
      phone: stay.ownerId.phone,
    });
  } catch (err) {
    console.error("contactOwnerController error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE STAY (Cloudinary upload)
const createStay = async (req, res) => {
  try {
    const { title, type, gender, rent, address, lat, lng } = req.body;

    if (!title || !type || !rent || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Cloudinary URLs
    const images = (req.files || []).map((file) => file.path);

    const stay = await Stay.create({
      title,
      type,
      gender: gender || "any",
      rent: Number(rent),
      address,
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
      images,                 // ✅ Cloudinary URLs stored here
      ownerId: req.user.id,   // ✅ from authMiddleware
      status: "pending",
    });

    res.status(201).json({ success: true, stay });
  } catch (err) {
    console.error("createStay error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllStays,
  searchStays,
  contactOwnerController,
  createStay, // ✅ export new controller
};
