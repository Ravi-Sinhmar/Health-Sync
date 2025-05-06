"use client"

import { useState, useEffect, useRef } from "react"
import { FiSend, FiRefreshCw, FiCopy, FiTrash2, FiUser, FiMessageSquare, FiX, FiMenu } from "react-icons/fi"
import { BsRobot, BsStars } from "react-icons/bs"
import apiConfig from "../config/api"

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory()
  }, [])

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${apiConfig.baseURL}/chat/history`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch chat history")

      const data = await response.json()
      setChatHistory(data)

      if (data.length > 0 && !currentChatId) {
        setCurrentChatId(data[0]._id)
        setMessages(data[0].messages)
      }
    } catch (error) {
      console.error("Error fetching chat history:", error)
    
    }
  }

  const createNewChat = async () => {
    try {
      const response = await fetch(`${apiConfig.baseURL}/chat/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to create new chat")

      const data = await response.json()
      setCurrentChatId(data._id)
      setMessages([])
      fetchChatHistory()
      inputRef.current?.focus()
      setIsSidebarOpen(false) // Close sidebar on mobile when creating new chat
    } catch (error) {
      console.error("Error creating new chat:", error)
      
    }
  }

  const loadChat = async (chatId) => {
    try {
      const response = await fetch(`${apiConfig.baseURL}/chat/${chatId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to load chat")

      const data = await response.json()
      setCurrentChatId(chatId)
      setMessages(data.messages)
      setIsSidebarOpen(false)
    } catch (error) {
      console.error("Error loading chat:", error)
      
    }
  }

  const deleteChat = async (chatId, e) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this chat?")) return

    try {
      const response = await fetch(`${apiConfig.baseURL}/chat/${chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to delete chat")

      setChatHistory(chatHistory.filter((chat) => chat._id !== chatId))

      if (chatId === currentChatId) {
        if (chatHistory.length > 1) {
          const nextChat = chatHistory.find((chat) => chat._id !== chatId)
          nextChat ? loadChat(nextChat._id) : createNewChat()
        } else {
          createNewChat()
        }
      }
    
    } catch (error) {
      console.error("Error deleting chat:", error)
     
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!currentChatId) {
      try {
        const response = await fetch(`${apiConfig.baseURL}/chat/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Failed to create new chat")

        const data = await response.json()
        setCurrentChatId(data._id)
      } catch (error) {
        console.error("Error creating new chat:", error)
       
        return
      }
    }

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`${apiConfig.baseURL}/chat/${currentChatId}/message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      fetchChatHistory()
    } catch (error) {
      console.error("Error sending message:", error)
      
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const regenerateResponse = async () => {
    if (messages.length === 0) return
    const lastUserMessageIndex = [...messages].reverse().findIndex((msg) => msg.role === "user")
    if (lastUserMessageIndex === -1) return

    const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex]
    setMessages((prev) => prev.slice(0, -lastUserMessageIndex))
    setIsLoading(true)

    try {
      const response = await fetch(`${apiConfig.baseURL}/chat/${currentChatId}/regenerate`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: lastUserMessage.content }),
      })

      if (!response.ok) throw new Error("Failed to regenerate response")

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      fetchChatHistory()
    } catch (error) {
      console.error("Error regenerating response:", error)
    
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => console.log("Text copied to clipboard"),
      (err) => console.error("Could not copy text: ", err)
    )
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getChatTitle = (chat) => {
    if (chat.title) return chat.title
    const firstUserMessage = chat.messages.find((msg) => msg.role === "user")
    if (firstUserMessage) {
      const title = firstUserMessage.content.slice(0, 30)
      return title.length < firstUserMessage.content.length ? `${title}...` : title
    }
    return "New Chat"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile header */}
      <div className="lg:hidden p-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMessageSquare size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <BsStars className="text-violet-600" size={20} />
          <h1 className="text-lg font-semibold text-gray-800">HealthAI</h1>
        </div>
        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Mobile sidebar header with close button */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BsStars className="text-violet-600" size={20} />
                <h2 className="font-semibold">HealthAI</h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <button
              onClick={createNewChat}
              className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              New Chat
            </button>

            <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">Chat History</h3>
            <div className="flex-1 overflow-y-auto space-y-1">
              {chatHistory.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => loadChat(chat._id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat._id
                      ? "bg-violet-100 text-violet-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{getChatTitle(chat)}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatDate(chat.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}

              {chatHistory.length === 0 && (
                <p className="text-sm text-gray-500 p-2">No chat history yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Desktop header */}
          <div className="hidden lg:flex p-4 border-b border-gray-200 items-center justify-center">
            <div className="flex items-center gap-2">
              <BsStars className="text-violet-600" size={20} />
              <h1 className="text-lg font-semibold text-gray-800">HealthAI</h1>
            </div>
          </div>

          <div className="h-10/12 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto ">
              {messages.length === 0 ? (
                <div className="h-9/12 flex flex-col items-center justify-center text-center p-4 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                    <BsRobot size={32} className="text-violet-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    HealthAI Assistant
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Ask me anything about nutrition, fitness, health tips, or your personal health data.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    {[
                      "What's a good meal plan for athletes?",
                      "How can I improve my sleep quality?",
                      "What exercises are good for my BMI?",
                      "Explain my blood pressure readings",
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion)}
                        className="text-left p-3 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[90%] ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        } gap-2`}
                      >
                        <div
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 ${
                            message.role === "user" ? "bg-violet-100 text-violet-600" : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {message.role === "user" ? <FiUser size={16} /> : <BsRobot size={16} />}
                        </div>

                        <div
                          className={`relative group rounded-xl p-4 ${
                            message.role === "user"
                              ? "bg-violet-600 text-white"
                              : "bg-gray-50 text-gray-800 border border-gray-200"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>

                          {message.role === "assistant" && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button
                                className="h-7 w-7 rounded-full bg-white shadow-sm hover:bg-gray-100 flex items-center justify-center"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <FiCopy size={14} className="text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-1">
                          <BsRobot size={16} />
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center">
                          <FiRefreshCw className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                          <span className="text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              {messages.length > 0 && (
                <div className="flex justify-center mb-3">
                  <button
                    onClick={regenerateResponse}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 hover:text-violet-600 rounded-md hover:bg-violet-50 transition-colors"
                  >
                    <FiRefreshCw size={12} />
                    Regenerate Response
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 flex-shrink-0 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors"
                >
                  <FiSend size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage