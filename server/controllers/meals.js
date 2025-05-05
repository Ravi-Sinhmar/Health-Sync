const Meal = require("../models/Meal")
const MealLog = require("../models/MealLog")

// Create a new meal
exports.createMeal = async (req, res) => {
  try {
    req.body.student = req.student.studentId

    const meal = await Meal.create(req.body)

    // If date is provided, add to meal log
    if (req.body.date) {
      let mealLog = await MealLog.findOne({
        student: req.student.studentId,
        date: req.body.date,
      })

      if (mealLog) {
        // Add to existing log
        mealLog.meals.push(meal._id)
        await mealLog.save()
      } else {
        // Create new log
        mealLog = await MealLog.create({
          date: req.body.date,
          meals: [meal._id],
          student: req.student.studentId,
        })
      }
    }

    res.status(201).json({ meal })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

// Get all meals for a student
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ student: req.student.studentId }).sort("-createdAt")

    res.status(200).json({ meals, count: meals.length })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get a single meal
exports.getMeal = async (req, res) => {
  try {
    const { id: mealId } = req.params

    const meal = await Meal.findOne({
      _id: mealId,
      student: req.student.studentId,
    })

    if (!meal) {
      return res.status(404).json({ msg: `No meal with id ${mealId}` })
    }

    res.status(200).json({ meal })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Update a meal
exports.updateMeal = async (req, res) => {
  try {
    const { id: mealId } = req.params

    const meal = await Meal.findOneAndUpdate({ _id: mealId, student: req.student.studentId }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!meal) {
      return res.status(404).json({ msg: `No meal with id ${mealId}` })
    }

    res.status(200).json({ meal })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

// Delete a meal
exports.deleteMeal = async (req, res) => {
  try {
    const { id: mealId } = req.params

    const meal = await Meal.findOneAndDelete({
      _id: mealId,
      student: req.student.studentId,
    })

    if (!meal) {
      return res.status(404).json({ msg: `No meal with id ${mealId}` })
    }

    // Remove from any meal logs
    await MealLog.updateMany({ student: req.student.studentId }, { $pull: { meals: mealId } })

    res.status(200).json({ msg: "Meal removed" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Toggle meal completion status
exports.toggleMealCompletion = async (req, res) => {
  try {
    const { id: mealId } = req.params

    const meal = await Meal.findOne({
      _id: mealId,
      student: req.student.studentId,
    })

    if (!meal) {
      return res.status(404).json({ msg: `No meal with id ${mealId}` })
    }

    meal.completed = !meal.completed
    await meal.save()

    res.status(200).json({ meal })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
