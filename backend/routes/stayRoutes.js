const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllStays,
  searchStaysByTitle,
  contactOwnerController,
} = require("../controllers/stayController");

router.get("/all", getAllStays);
router.get("/search", searchStaysByTitle);
router.get("/contact/:id", authMiddleware, contactOwnerController);

module.exports = router;
