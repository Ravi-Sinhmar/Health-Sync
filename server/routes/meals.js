const express = require("express")
const router = express.Router()
const {
  createMeal,
  getAllMeals,
  getMeal,
  updateMeal,
  deleteMeal,
  toggleMealCompletion,
} = require("../controllers/meals")

router.route("/").post(createMeal).get(getAllMeals)
router.route("/:id").get(getMeal).patch(updateMeal).delete(deleteMeal)
router.route("/:id/toggle-completion").patch(toggleMealCompletion)

module.exports = router
