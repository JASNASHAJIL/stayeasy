const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const stayController = require("../controllers/stayController");

router.get("/all", stayController.getAllStays);
router.get("/search", stayController.searchStays);
router.get("/contact/:id", authMiddleware, stayController.contactOwnerController);

module.exports = router;
