const express = require('express');
const router = express.Router();
const { getExercises, getExercise, searchExercises } = require('../controllers/exercise');

const { authenticate } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

router.route('/').get(getExercises);

router.route('/search').get(searchExercises);

router.route('/:id').get(getExercise);

module.exports = router;