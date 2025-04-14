const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an exercise name'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  instructions: {
    type: [String],
    required: [true, 'Please provide instructions']
  },
  muscleGroup: {
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'cardio'],
    required: [true, 'Please specify a muscle group']
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'plyometric'],
    required: [true, 'Please specify a category']
  },
  equipment: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search functionality
ExerciseSchema.index({
  name: 'text',
  description: 'text',
  muscleGroup: 'text',
  category: 'text'
});

module.exports = mongoose.model('Exercise', ExerciseSchema);