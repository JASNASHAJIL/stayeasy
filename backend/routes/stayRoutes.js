const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const stayController = require("../controllers/stayController");

// ✅ Cloudinary multer parser
const { parser } = require("../config/cloudinaryConfig");


// =========================
// CREATE STAY (with images)
// =========================
router.post(
  "/",                           // POST /api/stay
  authMiddleware,                // owner must be logged in
  parser.array("images", 10),    // upload up to 10 images → Cloudinary
  stayController.createStay      // controller must read req.files
);


// =========================
// READ ROUTES (existing)
// =========================
router.get("/all", stayController.getAllStays);
router.get("/search", stayController.searchStays);

// contact owner
router.get(
  "/contact/:id",
  authMiddleware,
  stayController.contactOwnerController
);


module.exports = router;
