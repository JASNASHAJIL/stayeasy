const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addStay,
  uploadMiddleware,
  getOwnerStays,
} = require("../controllers/ownerController");

router.post("/add", authMiddleware, uploadMiddleware, addStay);
router.get("/my-stays", authMiddleware, getOwnerStays);

module.exports = router;

