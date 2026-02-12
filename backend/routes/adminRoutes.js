const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getAllOwners,
   approveOwner,
  rejectOwner,
  getPendingStays,
  approveStay,
  rejectStay,
  getOwnerStays
} = require("../controllers/adminController");

// USERS
router.get("/users", authMiddleware, getAllUsers);

router.put("/approve-owner/:id", authMiddleware, approveOwner);
router.put("/reject-owner/:id", authMiddleware, rejectOwner);

// OWNERS
router.get("/owners", authMiddleware, getAllOwners);
router.get("/owner-stays/:ownerId", authMiddleware, getOwnerStays);


// STAYS
router.get("/stays/pending", authMiddleware, getPendingStays);
router.put("/stays/:id/approve", authMiddleware, approveStay);
router.put("/stays/:id/reject", authMiddleware, rejectStay);

module.exports = router;
