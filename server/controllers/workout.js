const Workout = require('../models/Workout');

// @desc    Get all workouts for a user
// @route   GET /api/workouts
// @access  Private
exports.getWorkouts = async (req, res) => {
  try {
    // Find all workouts for the logged in user, sorted by date (newest first)
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    console.error('Error getting workouts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get active workout
// @route   GET /api/workouts/active
// @access  Private
exports.getActiveWorkout = async (req, res) => {
  try {
    // Find the active workout for the logged in user
    const workout = await Workout.findOne({
      user: req.user.id,
      active: true,
      completed: false
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'No active workout found'
      });
    }

    res.status(200).json(workout);
  } catch (error) {
    console.error('Error getting active workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.createWorkout = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    // Remove _id fields from exercises as they're not valid ObjectIds
    if (req.body.exercises) {
      req.body.exercises = req.body.exercises.map(exercise => {
        const { _id, ...rest } = exercise;
        return rest;
      });
    }

    // Check if there's already an active workout
    const existingActive = await Workout.findOne({
      user: req.user.id,
      active: true,
      completed: false
    });

    // If there is an active workout, set it to inactive
    if (existingActive) {
      existingActive.active = false;
      await existingActive.save();
    }

    // Create new workout
    const workout = await Workout.create(req.body);

    res.status(201).json(workout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Make sure the workout belongs to the user
    const workout = await Workout.findOne({
      _id: id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Update the workout
    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Complete workout
// @route   PUT /api/workouts/:id/complete
// @access  Private
exports.completeWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this workout'
      });
    }

    // Update workout to completed and inactive
    workout.completed = true;
    workout.active = false;

    // Set duration if provided
    if (req.body.duration) {
      workout.duration = req.body.duration;
    }

    await workout.save();

    res.status(200).json(workout);
  } catch (error) {
    console.error('Error completing workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Make sure user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this workout'
      });
    }

    await workout.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get workout stats
// @route   GET /api/workouts/stats
// @access  Private
exports.getWorkoutStats = async (req, res) => {
  try {
    // Aggregate workout stats
    const stats = await Workout.aggregate([
      { $match: { user: req.user._id, completed: true } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          totalExercises: { $sum: { $size: '$exercises' } }
        }
      }
    ]);

    // Get most common exercises
    const exerciseFrequency = await Workout.aggregate([
      { $match: { user: req.user._id, completed: true } },
      { $unwind: '$exercises' },
      {
        $group: {
          _id: '$exercises.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      stats: stats[0] || { totalWorkouts: 0, avgDuration: 0, totalExercises: 0 },
      exerciseFrequency
    });
  } catch (error) {
    console.error('Error getting workout stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};