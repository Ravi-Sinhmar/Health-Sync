const MealLog = require("../models/MealLog")
const Meal = require("../models/Meal")
const ComprehensiveStudent = require("../models/Student")

// Get meal logs for a specific date
exports.getMealLogByDate = async (req, res) => {
  try {
    const { date } = req.params

    const mealLog = await MealLog.findOne({
      student: req.user.id,
      date,
    }).populate("meals")

    if (!mealLog) {
      return res.status(200).json({ meals: [] })
    }

    res.status(200).json({ meals: mealLog.meals })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get all meal logs for a student
exports.getAllMealLogs = async (req, res) => {
  try {
    const mealLogs = await MealLog.find({
      student: req.user.id,
    })
      .populate("meals")
      .sort("-date")

    res.status(200).json({ mealLogs, count: mealLogs.length })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get meal logs for a date range
exports.getMealLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: "Please provide start and end dates" })
    }

    const mealLogs = await MealLog.find({
      student: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("meals")
      .sort("date")

    res.status(200).json({ mealLogs, count: mealLogs.length })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get meal completion statistics
exports.getMealCompletionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Default to last 30 days if no dates provided
    const endDateValue = endDate ? new Date(endDate) : new Date()
    const startDateValue = startDate ? new Date(startDate) : new Date(endDateValue)
    startDateValue.setDate(startDateValue.getDate() - 30)

    const formattedStartDate = startDateValue.toISOString().split("T")[0]
    const formattedEndDate = endDateValue.toISOString().split("T")[0]

    // Find meal logs for the date range
    const mealLogs = await MealLog.find({
      student: req.user.id,
      date: { $gte: formattedStartDate, $lte: formattedEndDate },
    }).populate("meals")

    // Calculate statistics
    const totalDays = mealLogs.length
    let completedDays = 0
    let totalProtein = 0
    let lowProteinDays = 0

    // Get student weight for protein calculation
    const student = await ComprehensiveStudent.findById(req.user.id)
    const weight = student?.weight || 0
    const recommendedProtein = weight ? Math.round(weight * 0.8) : 0

    mealLogs.forEach((log) => {
      // Check if all meals in the day are completed
      const allMealsCompleted = log.meals.every((meal) => meal.completed)
      if (allMealsCompleted) completedDays++

      // Calculate total protein for the day
      const dayProtein = log.meals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
      totalProtein += dayProtein

      // Check if protein intake is low
      if (recommendedProtein > 0 && dayProtein < recommendedProtein * 0.7) {
        lowProteinDays++
      }
    })

    const stats = {
      totalDays,
      completedDays,
      completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
      averageProtein: totalDays > 0 ? Math.round(totalProtein / totalDays) : 0,
      recommendedProtein,
      lowProteinDays,
    }

    res.status(200).json({ stats })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Delete a meal log
exports.deleteMealLog = async (req, res) => {
  try {
    const { id: mealLogId } = req.params

    const mealLog = await MealLog.findOneAndDelete({
      _id: mealLogId,
      student: req.user.id,
    })

    if (!mealLog) {
      return res.status(404).json({ msg: `No meal log with id ${mealLogId}` })
    }

    res.status(200).json({ msg: "Meal log removed" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
