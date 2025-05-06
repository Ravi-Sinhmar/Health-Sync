// geminiAssistant.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: {
    role: "model",
    parts: [{ text: "You are a helpful health assistant for students and athletes. " +
      "Provide advice on nutrition, fitness, health metrics, and general wellness. " +
      "Be friendly, concise, and informative. " +
      "Do not provide medical diagnoses or treatment recommendations " +
      "that would require a licensed healthcare professional." }]
  }
});

exports.generateAIResponse = async (userMessage, conversationHistory) => {
  try {
    // Verify API key is loaded
    if (!process.env.API_KEY) {
      throw new Error("Gemini API key is missing");
    }

    // Format conversation history for Gemini
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7
      }
    });

    console.log("Sending to Gemini:", {
      userMessage,
      history: conversationHistory
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response:", text);
    return text;

  } catch (error) {
    console.error("Error generating AI response:");
    console.error(error);

    // Handle specific Gemini errors
    if (error.message.includes("API key not valid")) {
      return "Authentication error: Please check the API key";
    } else if (error.message.includes("quota")) {
      return "API quota exceeded: Please try again later";
    } else if (error.message.includes("safety")) {
      return "The question was blocked for safety reasons. Please try a different question.";
    }

    return "I'm having trouble processing your request. Please try again later.";
  }
};