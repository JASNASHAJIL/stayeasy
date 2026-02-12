const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const Owner = require("../models/Owner");

module.exports = (io) => {
  const onlineUsers = new Map();

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error: Token not provided"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // must contain { id, role }
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(String(socket.user.id), true);

    // ✅ Update DB status to Online
    const updateStatus = async (isOnline) => {
      try {
        const role = socket.user.role ? socket.user.role.toLowerCase() : "user";
        const Model = role === "owner" ? Owner : User;
        
        const res = await Model.findByIdAndUpdate(socket.user.id, {
          isOnline,
          lastSeen: isOnline ? null : new Date()
        });

        console.log(`🔄 Status Update: ${socket.user.id} (${role}) -> ${isOnline ? "Online" : "Offline"}. DB Updated? ${!!res}`);

        io.emit("userStatusUpdate", {
          userId: socket.user.id,
          isOnline,
          lastSeen: isOnline ? null : new Date()
        });
      } catch (err) {
        console.error("Status update error:", err);
      }
    };
    updateStatus(true);

    // ✅ NEW: join rooms
    socket.on("joinUserRoom", (userId) => {
      console.log("👤 joinUserRoom event received for:", userId);
      if (!userId) return;
      socket.join(String(userId));
      console.log("👤 User joined personal room:", userId);
    });

    socket.on("joinChatRoom", (roomId) => {
      socket.join(String(roomId));
      console.log("👥 Joined chat room:", roomId);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(String(socket.user.id));
      updateStatus(false);
    });

   socket.on("sendMessage", async ({ roomId, text, imageUrl }) => {
  try {
    if (!text?.trim() && !imageUrl) return;
    console.log("✅ sendMessage:", { roomId, text, imageUrl, user: socket.user });

    let msg = await Message.create({
      chatRoomId: roomId,
      senderId: socket.user.id || socket.user._id,
      senderRole: socket.user.role,
      text: text?.trim(),
      imageUrl: imageUrl,
      status: "delivered",
    });

    msg = msg.toObject();
    msg._id = String(msg._id);
    msg.chatRoomId = String(msg.chatRoomId);
    msg.senderId = String(msg.senderId);

    io.to(String(roomId)).emit("receiveMessage", msg);
    console.log("✅ emitted receiveMessage to room:", roomId);

    // ✅ Notify recipient directly (in case they haven't joined the room yet)
    const room = await ChatRoom.findById(roomId);
    if (room) {
      const senderId = String(socket.user.id || socket.user._id);
      const studentId = String(room.studentId);
      const ownerId = String(room.ownerId);

      const recipientId = senderId === studentId ? ownerId : studentId;

      console.log(`🔔 Notifying recipient directly: ${recipientId} (Sender: ${senderId})`);
      io.to(recipientId).emit("receiveMessage", msg);
    } else {
      console.log("❌ Room not found for notification:", roomId);
    }
  } catch (e) {
    console.log("❌ sendMessage error:", e.message);
  }
});


    // ✅ optional improved seen handler
    socket.on("seenMessage", async ({ messageId, roomId }) => {
      try {
        const updated = await Message.findByIdAndUpdate(
          messageId,
          { status: "seen" },
          { new: true }
        );
        if (updated && roomId) {
          io.to(String(roomId)).emit("messageSeen", updated);
        }
      } catch (err) {
        console.log("seenMessage error:", err.message);
      }
    });
  });
};
