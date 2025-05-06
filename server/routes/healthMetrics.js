const express = require("express");
const router = express.Router();
const {
  updateHealthMetrics,
  getHealthMetrics,
  calculateProteinRequirements,
} = require("../controllers/healthMetrics");
const { authenticate } = require("../middleware/auth");

// Apply 'authenticate' middleware to all routes in this router
router.use(authenticate);

// Protected routes (only accessible to authenticated users)
router.route("/")
  .get(getHealthMetrics)
  .patch(updateHealthMetrics);

router.route("/calculate-protein")
  .post(calculateProteinRequirements);

module.exports = router;