const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { startChat, getMessages, getUserChats, clearChat, markMessagesAsSeen, fixOwnership, chatImageMiddleware, uploadChatImage } = require("../controllers/ChatController");

router.post("/start", authMiddleware, startChat);
router.get("/my-rooms", authMiddleware, getUserChats);
router.get("/:roomId", authMiddleware, getMessages);
router.put("/:roomId/read", authMiddleware, markMessagesAsSeen);
router.delete("/:roomId", authMiddleware, clearChat);
router.post("/upload-image", authMiddleware, chatImageMiddleware, uploadChatImage);

// ✅ Temporary route to fix data
router.put("/fix-ownership", authMiddleware, fixOwnership);

module.exports = router;
