const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { startChat, getMessages } = require("../controllers/ChatController");

router.post("/start", authMiddleware, startChat);
router.get("/:roomId", authMiddleware, getMessages);

module.exports = router;
