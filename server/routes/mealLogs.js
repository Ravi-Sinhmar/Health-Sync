const express = require("express");
const router = express.Router();
const {
  getMealLogByDate,
  getAllMealLogs,
  getMealLogsByDateRange,
  deleteMealLog,
  getMealCompletionStats,
} = require("../controllers/mealLogs");
const { authenticate } = require("../middleware/auth");

// Apply authentication to all routes in this router
router.use(authenticate);

// Protected routes (require authentication)
router.route("/").get(getAllMealLogs);
router.route("/date-range").get(getMealLogsByDateRange);
router.route("/date/:date").get(getMealLogByDate);
router.route("/:id").delete(deleteMealLog);
router.route("/stats").get(getMealCompletionStats)

module.exports = router;