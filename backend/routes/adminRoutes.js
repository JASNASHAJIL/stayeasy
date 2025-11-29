const router = require("express").Router();
const {
  getAllUsers,
  getAllOwners,
  getPendingStays,
  approveStay,
  rejectStay
} = require("../controllers/adminController");

const { verifyAdminToken } = require("../middleware/authMiddleware");

// Admin-only routes
router.get("/users", verifyAdminToken, getAllUsers);
router.get("/owners", verifyAdminToken, getAllOwners);

router.get("/pending-stays", verifyAdminToken, getPendingStays);
router.put("/approve-stay/:id", verifyAdminToken, approveStay);
router.put("/reject-stay/:id", verifyAdminToken, rejectStay);

module.exports = router;
