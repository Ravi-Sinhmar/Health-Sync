const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a workout name']
  },
  exercises: [{
    name: String,
    muscleGroup: String,
    category: String,
    sets: [{
      setNumber: Number,
      weight: Number,
      reps: Number,
      completed: Boolean,
      notes: String
    }]
  }],
  date: {
    type: Date,
    default: Date.now
  },
  duration: Number, // in seconds
  estimatedTime: Number, // in seconds
  active: {
    type: Boolean,
    default: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  sets: [{
    setNumber: Number,
    targetReps: Number,
    completedReps: Number,
    weight: Number,
    weightUnit: { type: String, default: 'lbs' },
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', WorkoutSchema);