const express = require("express")
const router = express.Router()
const {
  createMealPlan,
  getMealPlansByWeek,
  getMealPlanByDay,
  addMealToPlan,
  removeMealFromPlan,
  deleteMealPlan,
} = require("../controllers/mealPlans")

router.route("/").post(createMealPlan)
router.route("/week/:weekStartDate").get(getMealPlansByWeek)
router.route("/day/:day/:weekStartDate").get(getMealPlanByDay)
router.route("/:id/meals").post(addMealToPlan)
router.route("/:id/meals/:mealId").delete(removeMealFromPlan)
router.route("/:id").delete(deleteMealPlan)

module.exports = router
