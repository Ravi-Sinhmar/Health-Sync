const Chat = require("../models/Chat")
const { generateAIResponse } = require("../services/aiService")

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    console.log("this is req.user",req.user);
    const newChat = new Chat({
      userId: req.user.id,
      messages: [],
    })

    await newChat.save()

    res.status(201).json(newChat)
  } catch (error) {
    console.error("Error creating chat:", error)
    res.status(500).json({ message: "Failed to create chat" })
  }
}

// Get all chats for the current user
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select("_id title messages updatedAt createdAt")

    res.status(200).json(chats)
  } catch (error) {
    console.error("Error fetching chat history:", error)
    res.status(500).json({ message: "Failed to fetch chat history" })
  }
}

// Get a specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    res.status(200).json(chat)
  } catch (error) {
    console.error("Error fetching chat:", error)
    res.status(500).json({ message: "Failed to fetch chat" })
  }
}

// Add a message to a chat
exports.addMessage = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Add user message
    chat.messages.push({
      role: "user",
      content: message,
    })

    // Generate AI response
    const aiResponse = await generateAIResponse(message, chat.messages)

    // Add AI response
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
    })

    // Set title if this is the first message
    if (chat.messages.length === 2 && !chat.title) {
      chat.title = message.slice(0, 50)
    }

    await chat.save()

    res.status(200).json({ response: aiResponse })
  } catch (error) {
    console.error("Error adding message:", error)
    res.status(500).json({ message: "Failed to add message" })
  }
}

// Regenerate the last AI response
exports.regenerateResponse = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user.id,
    })

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Get all messages except the last one (which should be an AI response)
    const previousMessages = chat.messages.slice(0, -1)

    // Generate new AI response
    const aiResponse = await generateAIResponse(message, previousMessages)

    // Replace the last message with the new AI response
    chat.messages[chat.messages.length - 1] = {
      role: "assistant",
      content: aiResponse,
      timestamp: Date.now(),
    }

    await chat.save()

    res.status(200).json({ response: aiResponse })
  } catch (error) {
    console.error("Error regenerating response:", error)
    res.status(500).json({ message: "Failed to regenerate response" })
  }
}

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const result = await Chat.deleteOne({
      _id: req.params.chatId,
      userId: req.user.id,
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Chat not found" })
    }

    res.status(200).json({ message: "Chat deleted successfully" })
  } catch (error) {
    console.error("Error deleting chat:", error)
    res.status(500).json({ message: "Failed to delete chat" })
  }
}
