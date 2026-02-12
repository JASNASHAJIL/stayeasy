// controllers/chatController.js
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const Stay = require("../models/Stay");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer setup for chat images
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `chat-${Date.now()}${path.extname(file.originalname)}`),
});
exports.chatImageMiddleware = multer({ storage }).single("image");

exports.uploadChatImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided." });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error("Upload chat image error:", err);
    res.status(500).json({ message: "Server error during image upload." });
  }
};

// USER starts chat (creates room if not exists)
exports.startChat = async (req, res) => {
  try {
    const { stayId } = req.body || {};
    const userId = req.user.id;
    const role = req.user.role;

    if (!stayId) return res.status(400).json({ message: "stayId is required" });

    if (role !== "user") {
      return res.status(403).json({ message: "Only users can start chat" });
    }

    const stay = await Stay.findById(stayId).select("ownerId title");
    if (!stay) return res.status(404).json({ message: "Stay not found" });

    console.log(`🆕 startChat - Stay: ${stay._id}, Owner: ${stay.ownerId}`);

    if (!stay.ownerId) {
      return res.status(500).json({ message: "Stay has no ownerId configured" });
    }

    // ✅ FIX: Always set ownerId (not only on insert)
    const room = await ChatRoom.findOneAndUpdate(
      { stayId, studentId: userId },
      {
        $set: { ownerId: stay.ownerId }, // ✅ update owner always
        $setOnInsert: { stayId, studentId: userId },
      },
      { upsert: true, new: true }
    );

    const fullRoom = await ChatRoom.findById(room._id)
      .populate("stayId", "title")
      .populate("ownerId", "name profilePic isOnline lastSeen")
      .populate("studentId", "name profilePic isOnline lastSeen");

    res.json(fullRoom);
  } catch (err) {
    console.error("startChat error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET rooms for user/owner
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // ✅ Explicit ObjectId casting to ensure query matches DB type
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Filter based on role
    const filter = (role === "owner" || role === "Owner") ? { ownerId: userObjectId } : { studentId: userObjectId };

    const rooms = await ChatRoom.find(filter)
      .populate("stayId", "title")
      .populate("ownerId", "name profilePic isOnline lastSeen")
      .populate("studentId", "name profilePic isOnline lastSeen")
      .sort({ updatedAt: -1 })
      .lean();

    // ✅ Faster: get lastMessage + unreadCount without N+1
    const roomIds = rooms.map((r) => r._id);

    const lastMessages = await Message.aggregate([
      { $match: { chatRoomId: { $in: roomIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatRoomId",
          text: { $first: "$text" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    const lastMap = new Map(lastMessages.map((m) => [String(m._id), m]));

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          chatRoomId: { $in: roomIds },
          senderId: { $ne: userId },
          status: { $ne: "seen" },
        },
      },
      { $group: { _id: "$chatRoomId", count: { $sum: 1 } } },
    ]);

    const unreadMap = new Map(unreadCounts.map((u) => [String(u._id), u.count]));

    for (const room of rooms) {
      const key = String(room._id);
      room.lastMessage = lastMap.get(key)?.text || "";
      room.unreadCount = unreadMap.get(key) || 0;
    }

    res.json(rooms);
  } catch (err) {
    console.error("getUserChats error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ UTILITY: Fix ownership of old data (Dev only)
exports.fixOwnership = async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role !== "owner") return res.status(403).json({ message: "Owners only" });

    // Update all Stays and ChatRooms to belong to the current logged-in owner
    const stays = await Stay.updateMany({}, { ownerId: userId });
    const chats = await ChatRoom.updateMany({}, { ownerId: userId });

    res.json({ success: true, message: `Updated ${stays.modifiedCount} stays and ${chats.modifiedCount} chats to your ID.` });
  } catch (err) {
    console.error("fixOwnership error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET messages for a room
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ chatRoomId: roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Clear chat (delete messages in room)
exports.clearChat = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.studentId.toString() !== userId && room.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Message.deleteMany({ chatRoomId: roomId });
    res.json({ success: true, message: "Chat cleared" });
  } catch (err) {
    console.error("clearChat error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark messages as seen
exports.markMessagesAsSeen = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { chatRoomId: roomId, senderId: { $ne: userId }, status: { $ne: "seen" } },
      { $set: { status: "seen" } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("markMessagesAsSeen error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
