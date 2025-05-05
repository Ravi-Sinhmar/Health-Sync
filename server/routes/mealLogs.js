const express = require("express")
const router = express.Router()
const { getMealLogByDate, getAllMealLogs, getMealLogsByDateRange, deleteMealLog } = require("../controllers/mealLogs")

router.route("/").get(getAllMealLogs)
router.route("/date-range").get(getMealLogsByDateRange)
router.route("/date/:date").get(getMealLogByDate)
router.route("/:id").delete(deleteMealLog)

module.exports = router
