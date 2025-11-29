const router = require("express").Router();
const { getAllStays } = require("../controllers/stayController");

// Public route for users
router.get("/all", getAllStays);

module.exports = router;
