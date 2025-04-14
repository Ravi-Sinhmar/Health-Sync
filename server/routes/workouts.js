const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getActiveWorkout,
  createWorkout,
  updateWorkout,
  completeWorkout,
  deleteWorkout,
  getWorkoutStats,
} = require('../controllers/workout');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

router.route('/active').get(getActiveWorkout);
router.route('/stats').get(getWorkoutStats);
// router.route('/calculate-time').post(calculateWorkoutTime);

router.route('/:id')
  .put(updateWorkout)
  .delete(deleteWorkout);

router.route('/:id/complete').put(completeWorkout);

module.exports = router;