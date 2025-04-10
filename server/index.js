const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const authRoutes = require("./routes/auth")
const studentRoutes = require("./routes/students")
const supportRoutes = require("./routes/support")
const cookieParser = require('cookie-parser');
const test = require('./models/test');


const URL = process.env.NODE_ENV == 'Production' ? process.env.Remote_url : 'http://localhost:5173'


// Load environment variables


// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
app.use(cors({
  origin: 'https://health-sync-pro.vercel.app', // Frontend domain
  credentials: true, // Allow cookies
}));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "https://health-sync-pro.vercel.app"); // Frontend URL
  next();
});
// Add this after your CORS middleware
app.use(cookieParser());
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/health-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/auth", authRoutes)
app.use("/students", studentRoutes)
app.use("/support", supportRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})