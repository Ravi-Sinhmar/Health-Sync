const express = require("express")
const router = express.Router()
const studentController = require("../controllers/studentController")
const { authenticate } = require("../middleware/auth");

// Student routes
router.post("/save", studentController.saveStudentProfile)
router.get("/", authenticate, studentController.getAllStudents)
router.get("/profile", authenticate, studentController.getStudentProfile)
router.get("/:email/basic", authenticate, studentController.getBasicStudentProfile)
router.get("/:email/health-data", authenticate, studentController.getHealthData)
router.post("/metrics", authenticate, studentController.saveMetrics)
router.post("/:email/health-data", authenticate, studentController.updateHealthData);
router.put("/healthdata/save",authenticate, studentController.updateHealthData);
router.put("/profile/edit",authenticate, studentController.userData);


module.exports = router;

