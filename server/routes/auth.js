const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { authenticate } = require("../middleware/auth")


// Auth routes
router.get('/check',authenticate, authController.checkAuth)  // Fixed this line
router.post("/signup", authController.signup)
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/verify-otp", authController.verifyOTP)
router.post("/resend-otp", authController.resendOTP)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)

module.exports = router

