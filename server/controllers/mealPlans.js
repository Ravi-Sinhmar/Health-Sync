const MealPlan = require("../models/MealPlan")
const Meal = require("../models/Meal")

// Create a meal plan for a specific day
exports.createMealPlan = async (req, res) => {
  try {
    const { day, weekStartDate, meals } = req.body

    if (!day || !weekStartDate) {
      return res.status(400).json({ msg: "Please provide day and week start date" })
    }

    // Check if meal plan already exists for this day and week
    const existingPlan = await MealPlan.findOne({
      student: req.user.id,
      day,
      weekStartDate: new Date(weekStartDate),
    })

    if (existingPlan) {
      // Update existing plan
      existingPlan.meals = meals || existingPlan.meals
      await existingPlan.save()

      const populatedPlan = await MealPlan.findById(existingPlan._id).populate("meals")

      return res.status(200).json({ mealPlan: populatedPlan })
    }

    // Create new plan
    const mealPlan = await MealPlan.create({
      day,
      weekStartDate: new Date(weekStartDate),
      meals: meals || [],
      student: req.user.id,
    })

    const populatedPlan = await MealPlan.findById(mealPlan._id).populate("meals")

    res.status(201).json({ mealPlan: populatedPlan })
  } catch (error) {
    res.status(400).json({ msg: error.message })
  }
}

// Get meal plans for a specific week
exports.getMealPlansByWeek = async (req, res) => {
  try {
    const { weekStartDate } = req.params

    if (!weekStartDate) {
      return res.status(400).json({ msg: "Please provide week start date" })
    }

    const startDate = new Date(weekStartDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    const mealPlans = await MealPlan.find({
      student: req.user.id,
      weekStartDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("meals")
      .sort("day")

    res.status(200).json({ mealPlans, count: mealPlans.length })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get meal plan for a specific day
exports.getMealPlanByDay = async (req, res) => {
  try {
    const { day, weekStartDate } = req.params

    if (!day || !weekStartDate) {
      return res.status(400).json({ msg: "Please provide day and week start date" })
    }

    const mealPlan = await MealPlan.findOne({
      student: req.user.id,
      day,
      weekStartDate: new Date(weekStartDate),
    }).populate("meals")

    if (!mealPlan) {
      return res.status(200).json({ meals: [] })
    }

    res.status(200).json({ mealPlan })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Add a meal to a meal plan
exports.addMealToPlan = async (req, res) => {
  try {
    const { id: planId } = req.params
    const { mealId } = req.body

    if (!mealId) {
      return res.status(400).json({ msg: "Please provide meal ID" })
    }

    // Verify meal exists and belongs to student
    const meal = await Meal.findOne({
      _id: mealId,
      student: req.user.id,
    })

    if (!meal) {
      return res.status(404).json({ msg: `No meal with id ${mealId}` })
    }

    const mealPlan = await MealPlan.findOne({
      _id: planId,
      student: req.user.id,
    })

    if (!mealPlan) {
      return res.status(404).json({ msg: `No meal plan with id ${planId}` })
    }

    // Add meal if not already in plan
    if (!mealPlan.meals.includes(mealId)) {
      mealPlan.meals.push(mealId)
      await mealPlan.save()
    }

    const populatedPlan = await MealPlan.findById(mealPlan._id).populate("meals")

    res.status(200).json({ mealPlan: populatedPlan })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Remove a meal from a meal plan
exports.removeMealFromPlan = async (req, res) => {
  try {
    const { id: planId, mealId } = req.params

    const mealPlan = await MealPlan.findOne({
      _id: planId,
      student: req.user.id,
    })

    if (!mealPlan) {
      return res.status(404).json({ msg: `No meal plan with id ${planId}` })
    }

    mealPlan.meals = mealPlan.meals.filter((meal) => meal.toString() !== mealId)

    await mealPlan.save()

    const populatedPlan = await MealPlan.findById(mealPlan._id).populate("meals")

    res.status(200).json({ mealPlan: populatedPlan })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Delete a meal plan
exports.deleteMealPlan = async (req, res) => {
  try {
    const { id: planId } = req.params

    const mealPlan = await MealPlan.findOneAndDelete({
      _id: planId,
      student: req.user.id,
    })

    if (!mealPlan) {
      return res.status(404).json({ msg: `No meal plan with id ${planId}` })
    }

    res.status(200).json({ msg: "Meal plan removed" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
