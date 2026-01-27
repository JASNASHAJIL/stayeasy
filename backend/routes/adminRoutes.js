const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getAllOwners,
  getPendingStays,
  approveStay,
  rejectStay,
} = require("../controllers/adminController");

// USERS
router.get("/users", authMiddleware, getAllUsers);

// OWNERS
router.get("/owners", authMiddleware, getAllOwners);

// STAYS
router.get("/stays/pending", authMiddleware, getPendingStays);
router.put("/stays/:id/approve", authMiddleware, approveStay);
router.put("/stays/:id/reject", authMiddleware, rejectStay);

module.exports = router;
