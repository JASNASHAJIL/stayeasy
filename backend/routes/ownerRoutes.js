// routes/ownerRoutes.js
const router = require("express").Router();
const { addStay, uploadMiddleware, getOwnerStays } = require("../controllers/ownerController");
const { verifyOwnerToken } = require("../middleware/authMiddleware");

// Owner-only routes
router.post("/add", verifyOwnerToken, uploadMiddleware, addStay);
router.get("/my-stays", verifyOwnerToken, getOwnerStays);

module.exports = router;
