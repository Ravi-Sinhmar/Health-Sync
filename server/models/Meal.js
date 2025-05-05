const mongoose = require("mongoose")

const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a meal name"],
    trim: true,
  },
  time: {
    type: String,
    required: [true, "Please provide a time"],
  },
  calories: {
    type: Number,
    required: [true, "Please provide calories"],
  },
  protein: {
    type: Number,
    required: [true, "Please provide protein amount"],
  },
  carbs: {
    type: Number,
    required: [true, "Please provide carbs amount"],
  },
  fat: {
    type: Number,
    required: [true, "Please provide fat amount"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  ingredients: {
    type: [String],
  },
  notes: {
    type: String,
  },
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

module.exports = mongoose.model("Meal", MealSchema)
