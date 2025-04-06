"use client"

import { useState } from "react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Mail, MessageCircle, HelpCircle, FileText, Phone } from "react-feather"
import toast from "react-hot-toast"

const Help = () => {
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!subject.trim()) {
      toast.error("Please enter a subject")
      return
    }

    if (!message.trim()) {
      toast.error("Please enter your message")
      return
    }

    setIsSubmitting(true)

    try {
      // API call to send support message
      const response = await fetch("http://localhost:5000/support/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject, message }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast.success("Your message has been sent successfully")
      setSubject("")
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <div className="text-center mb-8">
            <HelpCircle className="h-12 w-12 text-violet-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="mt-2 text-gray-600">We're here to help you with any questions or issues you may have.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-violet-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-violet-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Contact Us</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Call us at +1 (123) 456-7890 for immediate assistance.
                    <br />
                    Available Monday-Friday, 9am-5pm.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-violet-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Email Support</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Send an email to support@healthtrack.com
                    <br />
                    We'll respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FileText className="h-6 w-6 text-violet-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Documentation</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Browse our documentation for detailed guides and tutorials.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 p-4 rounded-lg">
              <div className="flex items-start">
                <MessageCircle className="h-6 w-6 text-violet-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Live Chat</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Chat with our support team for real-time assistance.
                    <br />
                    Available during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-gray-600 mb-6">We'll respond to your inquiry within 24 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                  placeholder="What is your inquiry about?"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600"
                  placeholder="Please describe your issue or question in detail..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Help

