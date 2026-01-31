const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const Stay = require("../models/Stay");

exports.startChat = async (req, res) => {
  const { stayId } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (role !== "user")
    return res.status(403).json({ message: "Only users can start chat" });

  const stay = await Stay.findById(stayId);
  if (!stay) return res.status(404).json({ message: "Stay not found" });

  let room = await ChatRoom.findOne({
    stayId,
    studentId: userId,
  });

  if (!room) {
    room = await ChatRoom.create({
      stayId,
      studentId: userId,
      ownerId: stay.ownerId,
    });
  }

  res.json(room);
};

exports.getMessages = async (req, res) => {
  const { roomId } = req.params;

  const messages = await Message.find({ chatRoomId: roomId });
  res.json(messages);
};
