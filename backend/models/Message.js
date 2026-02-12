const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderRole: {
    type: String,
    enum: ["user", "owner"],
    required: true,
  },
  text: String,
  imageUrl: { type: String, default: null },

  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
  },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
