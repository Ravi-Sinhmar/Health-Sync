const express = require("express");
const router = express.Router();
const { authenticate } = require("./../middleware/auth");
const {
  createMeal,
  getAllMeals,
  getMealsByDate,
  getMeal,
  updateMeal,
  deleteMeal,
  toggleMealCompletion,
} = require("../controllers/meals");

// Apply authentication middleware to protected routes
router.route("/").post(authenticate, createMeal).get(authenticate, getAllMeals);
router.route("/date/:date").get(authenticate, getMealsByDate);
router.route("/:id")
  .get(authenticate, getMeal)
  .patch(authenticate, updateMeal)
  .delete(authenticate, deleteMeal);
router.route("/:id/toggle-completion").patch(authenticate, toggleMealCompletion);

module.exports = router;
