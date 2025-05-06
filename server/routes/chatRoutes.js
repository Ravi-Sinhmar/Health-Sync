const express = require("express")
const router = express.Router()
const chatController = require("../controllers/chatController")
const { authenticate } = require("../middleware/auth")

// Apply authentication middleware to all chat routes
router.use(authenticate)

// Create a new chat
router.post("/create", chatController.createChat)

// Get all chats for the current user
router.get("/history", chatController.getChatHistory)

// Get a specific chat by ID
router.get("/:chatId", chatController.getChatById)

// Add a message to a chat
router.post("/:chatId/message", chatController.addMessage)

// Regenerate the last AI response
router.post("/:chatId/regenerate", chatController.regenerateResponse)

// Delete a chat
router.delete("/:chatId", chatController.deleteChat)

module.exports = router
