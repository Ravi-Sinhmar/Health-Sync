const mongoose = require("mongoose")

const HealthDataSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
    unique: true,
  },
  metrics: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("HealthData", HealthDataSchema)

