const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  stayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stay",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
