const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
})

module.exports = mongoose.model("TestFinalllllllllll", OTPSchema)

