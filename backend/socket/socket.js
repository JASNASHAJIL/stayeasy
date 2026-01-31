const jwt = require("jsonwebtoken");

module.exports = (io) => {
  const onlineUsers = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.user.id, true);

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.user.id);
    });

    socket.on("sendMessage", async ({ roomId, text }) => {
      const msg = await Message.create({
        chatRoomId: roomId,
        senderId: socket.user.id,
        senderRole: socket.user.role,
        text,
        status: "delivered",
      });

      io.to(roomId).emit("receiveMessage", msg);
    });

    socket.on("seenMessage", async (messageId) => {
      await Message.findByIdAndUpdate(messageId, { status: "seen" });
    });
  });
};
