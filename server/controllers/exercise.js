const Exercise = require('../models/Exercise');

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private
exports.getExercises = async (req, res) => {
  try {
    // Build query
    const query = {};

    // Filter by muscle group if provided
    if (req.query.muscleGroup) {
      query.muscleGroup = req.query.muscleGroup;
    }

    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by difficulty if provided
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    // Find exercises based on query
    const exercises = await Exercise.find(query).sort('name');

    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error getting exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single exercise
// @route   GET /api/exercises/:id
// @access  Private
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.status(200).json(exercise);
  } catch (error) {
    console.error('Error getting exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search exercises
// @route   GET /api/exercises/search
// @access  Private
exports.searchExercises = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    // Search using text index
    const exercises = await Exercise.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);

    // If no results with text search, try regex search
    if (exercises.length === 0) {
      const regexExercises = await Exercise.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { muscleGroup: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      }).limit(20);

      return res.status(200).json(regexExercises);
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error searching exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};