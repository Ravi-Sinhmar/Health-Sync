// models/Bet.js
const mongoose = require('mongoose');

const dummyScheam = new mongoose.Schema({
  userId: { type: String, required: true }, // Add if you have user auth
  bet: { type: Number, required: true },
  amountChanged: { type: Number, required: true },
  remainingAmount: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  timestamp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dummy', dummyScheam);