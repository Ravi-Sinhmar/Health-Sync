const mongoose = require("mongoose")

const MealPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "Please provide a day"],
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
  weekStartDate: {
    type: Date,
    required: [true, "Please provide a week start date"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("MealPlan", MealPlanSchema)
