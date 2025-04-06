const Support = require("../models/Support")
const nodemailer = require("nodemailer")
const Student = require("../models/Student")

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

exports.sendSupportMessage = async (req, res) => {
  try {
    const { subject, message } = req.body
    const userId = req.user.id

    // Get user details
    const user = await Student.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get student details if available
    const student = await Student.findOne({ email: user.email })
    const name = student ? student.name : user.email

    // Save support message
    const supportMessage = new Support({
      userId,
      email: user.email,
      name,
      subject,
      message,
    })

    await supportMessage.save()

    // Send email to company
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL || process.env.EMAIL_USER, // Use company email from env or fallback to sender
      subject: `Help and Support Query: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">New Support Request</h2>
          <p><strong>From:</strong> ${name} (${user.email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            This message was sent from the Health Tracker Support System.
          </p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: "Support message sent successfully" })
  } catch (error) {
    console.error("Send support message error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

