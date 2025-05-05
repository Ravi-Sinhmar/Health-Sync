const mongoose = require("mongoose")

const MealLogSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Please provide a date"],
  },
  meals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
    },
  ],
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("MealLog", MealLogSchema)
