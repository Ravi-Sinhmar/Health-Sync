const express = require("express")
const router = express.Router()
const { updateHealthMetrics, getHealthMetrics, calculateProteinRequirements } = require("../controllers/healthMetrics")

router.route("/").get(getHealthMetrics).patch(updateHealthMetrics)
router.route("/calculate-protein").post(calculateProteinRequirements)

module.exports = router
