const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addStay,
  uploadMiddleware,
  profilePicMiddleware,
  getOwnerStays,
  deleteStay,
  updateStay,
  updateProfile,
} = require("../controllers/ownerController");

router.post("/add", authMiddleware, uploadMiddleware, addStay);
router.get("/my-stays", authMiddleware, getOwnerStays);
router.delete("/delete/:id", authMiddleware, deleteStay);
router.put("/update/:id", authMiddleware, updateStay);
router.put("/profile", authMiddleware, profilePicMiddleware, updateProfile);

module.exports = router;
