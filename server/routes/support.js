const express = require("express")
const router = express.Router()
const supportController = require("../controllers/supportController")
const { authenticate } = require("../middleware/auth")

// Support routes
router.post("/message", authenticate, supportController.sendSupportMessage)

module.exports = router

