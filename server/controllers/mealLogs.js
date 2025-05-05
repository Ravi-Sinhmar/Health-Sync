const MealLog = require("../models/MealLog")

// Get meal logs for a specific date
exports.getMealLogByDate = async (req, res) => {
  try {
    const { date } = req.params

    const mealLog = await MealLog.findOne({
      student: req.student.studentId,
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
      student: req.student.studentId,
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
      student: req.student.studentId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("meals")
      .sort("date")

    res.status(200).json({ mealLogs, count: mealLogs.length })
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
      student: req.student.studentId,
    })

    if (!mealLog) {
      return res.status(404).json({ msg: `No meal log with id ${mealLogId}` })
    }

    res.status(200).json({ msg: "Meal log removed" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
