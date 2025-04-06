const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const dotenv = require("dotenv")
dotenv.config()
const URL = process.env.NODE_ENV == 'Production' ? process.env.Remote_url : 'http://localhost:5173'
console.log("URL is this",URL);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: 'techboi.1424@gmail.com',
    to: email,
    subject: "Verification Code for Health Tracker",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #3b82f6;">Health Tracker Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; margin: 20px 0; color: #1e40af; background-color: #eff6ff; padding: 10px; border-radius: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to set auth cookie
const setAuthCookie = (res, userId, email) => {
  const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "1d",
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    domain: process.env.NODE_ENV === 'production' ? URL : undefined
  });
};

// Controller methods
exports.checkAuth = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ 
        user: {
          id: req.user.id,
          email: req.user.email
        }
      });
    }
    res.status(401).json({ message: "Not authenticated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    // Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const newOTP = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    await newOTP.save();

    // Create new user with unverified status
    const newUser = new Student({
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await newUser.save();

    // Set auth cookie immediately after signup
    setAuthCookie(res, newUser._id, newUser.email);

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(201).json({ 
      message: "User registered successfully. Please verify your email.",
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set auth cookie
    setAuthCookie(res, user._id, user.email);

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
      },
      message: "Logged in successfully"
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: "Logged out successfully" });
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP in database
    const otpRecord = await OTP.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user verification status
    const user = await Student.findOneAndUpdate(
      { email }, 
      { isVerified: true },
      { new: true } // Return the updated document
    );
  
    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Set auth cookie after verification
    setAuthCookie(res, user._id, user.email);

    res.status(200).json({ 
      message: "Email verified successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    const newOTP = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });
    await newOTP.save();

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    const newOTP = new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isPasswordReset: true,
    });
    await newOTP.save();

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    // Find OTP in database
    const otpRecord = await OTP.findOne({
      email,
      otp: token,
      expiresAt: { $gt: new Date() },
      isPasswordReset: true,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and get the updated user
    const user = await Student.findOneAndUpdate(
      { email }, 
      { password: hashedPassword },
      { new: true }
    );

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Optionally set auth cookie after password reset
    setAuthCookie(res, user._id, user.email);

    res.status(200).json({ 
      message: "Password reset successfully",
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};