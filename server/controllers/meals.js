const Meal = require("../models/Meal")
const MealLog = require("../models/MealLog")

// Create a new meal
exports.createMeal = async (req, res) => {
  try {
    console.log(req.body);

    // Ensure req.user exists and has student ID
    if (!req.user || !req.user.id) {
      return res.status(400).json({ msg: "User authentication required" });
    }

    // Add student ID to request body
    req.body.student = req.user.id;

    const meal = await Meal.create(req.body);
    console.log("Hi meal", meal);

    // If date is provided, add to meal log
    if (req.body.date) {
      let mealLog = await MealLog.findOne({
        student: req.user.id,
        date: req.body.date,
      });

      if (mealLog) {
        mealLog.meals.push(meal._id);
        await mealLog.save();
      } else {
        mealLog = await MealLog.create({
          date: req.body.date,
          meals: [meal._id],
          student: req.user.id, // Ensure correct reference
        });
      }
    }

    res.status(201).json({ meal });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

// Get all meals for a student
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ student: req.user.id }).sort("-createdAt")

    res.status(200).json({ meals, count: meals.length })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get meals for a specific date
exports.getMealsByDate = async (req, res) => {
  try {
    const { date } = req.params

    if (!date) {
      return res.status(400).json({ msg: "Please provide a date" })
    }

    // Find meal log for the date
    const mealLog = await MealLog.findOne({
      student: req.user.id,
      date,
    })

    if (!mealLog) {
      return res.status(200).json({ meals: [] })
    }

    // Get all meals from the meal log
    const meals = await Meal.find({
      _id: { $in: mealLog.meals },
      student: req.user.id,
    }).sort("time")

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
      student: req.user.id,
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

    const meal = await Meal.findOneAndUpdate({ _id: mealId, student: req.user.id }, req.body, {
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
      student: req.user.id,
    })

    if (!meal) {
      return res.status(404).json({ msg: `No meal with id ${mealId}` })
    }

    // Remove from any meal logs
    await MealLog.updateMany({ student: req.user.id }, { $pull: { meals: mealId } })

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
      student: req.user.id,
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
