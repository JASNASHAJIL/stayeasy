const router = require("express").Router();
const {
  registerController,
  loginController,
  forgotPasswordController,
  verifyOtpController
} = require("../controllers/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);

module.exports = router;
