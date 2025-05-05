const Student = require("../models/Student")

// Update student health metrics
exports.updateHealthMetrics = async (req, res) => {
  try {
    const student = await Student.findById(req.student.studentId)

    if (!student) {
      return res.status(404).json({ msg: "Student not found" })
    }

    // Update health metrics
    const healthFields = [
      "height",
      "weight",
      "bloodPressure",
      "heartRate",
      "temperature",
      "oxygenSaturation",
      "vision",
      "hearing",
      "allergies",
      "medications",
      "chronicConditions",
      "immunizations",
      "dietaryRestrictions",
      "physicalActivity",
      "sleepHours",
      "mentalHealthNotes",
      "emergencyContact",
      "lastCheckupDate",
    ]

    healthFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field]
      }
    })

    await student.save()

    res.status(200).json({ student })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

// Get student health metrics
exports.getHealthMetrics = async (req, res) => {
  try {
    const student = await Student.findById(req.student.studentId)

    if (!student) {
      return res.status(404).json({ msg: "Student not found" })
    }

    // Extract health metrics
    const healthMetrics = {
      height: student.height,
      weight: student.weight,
      bmi: student.bmi,
      bloodPressure: student.bloodPressure,
      heartRate: student.heartRate,
      temperature: student.temperature,
      oxygenSaturation: student.oxygenSaturation,
      vision: student.vision,
      hearing: student.hearing,
      allergies: student.allergies,
      medications: student.medications,
      chronicConditions: student.chronicConditions,
      immunizations: student.immunizations,
      dietaryRestrictions: student.dietaryRestrictions,
      physicalActivity: student.physicalActivity,
      sleepHours: student.sleepHours,
      mentalHealthNotes: student.mentalHealthNotes,
      emergencyContact: student.emergencyContact,
      lastCheckupDate: student.lastCheckupDate,
      healthStatus: student.healthStatus,
    }

    res.status(200).json({ healthMetrics })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Calculate protein requirements
exports.calculateProteinRequirements = async (req, res) => {
  try {
    const { weight, activityLevel, goal } = req.body

    if (!weight) {
      return res.status(400).json({ msg: "Please provide weight" })
    }

    const weightNum = Number.parseFloat(weight)
    let multiplier = 0.8 // Base multiplier for sedentary

    // Adjust multiplier based on activity level
    if (activityLevel === "light") multiplier = 1.0
    else if (activityLevel === "moderate") multiplier = 1.2
    else if (activityLevel === "active") multiplier = 1.6
    else if (activityLevel === "very-active") multiplier = 1.8

    // Adjust multiplier based on goal
    if (goal === "lose") multiplier += 0.2
    else if (goal === "gain") multiplier += 0.4

    const proteinGrams = Math.round(weightNum * multiplier)

    res.status(200).json({
      proteinRequirement: proteinGrams,
      weight: weightNum,
      activityLevel,
      goal,
    })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}
