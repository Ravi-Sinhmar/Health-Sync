"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Activity,
  Calculator,
  Utensils,
  ArrowLeft,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import MealForm from "./../components/MealForm"
import NutritionSummary from "./../components/NutritionSummary"

// Sample data - in a real app this would come from an API or database
const initialMeals = [
  {
    id: 1,
    name: "Breakfast Oatmeal",
    day: "Monday",
    time: "08:00",
    calories: 350,
    protein: 12,
    carbs: 45,
    fat: 9,
    ingredients: ["Oats", "Almond milk", "Banana", "Honey", "Chia seeds"],
    notes: "Add cinnamon for extra flavor",
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    day: "Monday",
    time: "13:00",
    calories: 420,
    protein: 35,
    carbs: 20,
    fat: 15,
    ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Lemon juice"],
    notes: "Use low-sodium seasoning",
  },
  {
    id: 3,
    name: "Salmon with Vegetables",
    day: "Monday",
    time: "19:00",
    calories: 520,
    protein: 40,
    carbs: 25,
    fat: 22,
    ingredients: ["Salmon fillet", "Broccoli", "Carrots", "Brown rice", "Olive oil", "Garlic"],
    notes: "Cook salmon with skin on for extra flavor",
  },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function MealPlanner() {
  const navigate = useNavigate()
  const location = useLocation()
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(getWeekDates())
  const [showMealForm, setShowMealForm] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showMealDetail, setShowMealDetail] = useState(false)

  // Navigation items for health features
  const navItems = [
    { name: "Health Dashboard", path: "/dashboard", icon: Activity },
    { name: "Protein Calculator", path: "/meal/protein/calculator", icon: Calculator },
    { name: "Meal Tracker", path: "/meal/tracker", icon: Utensils },
  ]

  // Function to check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoading(true)
        // Format the date for the API
        const weekStartDate = currentWeek[0].toISOString().split("T")[0]

        const response = await fetch(`/api/meal-plans/week/${weekStartDate}`)

        if (!response.ok) {
          throw new Error("Failed to fetch meal plans")
        }

        const data = await response.json()

        // Transform the data to match our component's structure
        const transformedMeals = []

        data.mealPlans.forEach((plan) => {
          plan.meals.forEach((meal) => {
            transformedMeals.push({
              id: meal._id,
              name: meal.name,
              day: plan.day,
              time: meal.time || "12:00",
              calories: meal.calories || 0,
              protein: meal.protein || 0,
              carbs: meal.carbs || 0,
              fat: meal.fat || 0,
              ingredients: meal.ingredients || [],
              notes: meal.notes || "",
            })
          })
        })

        setMeals(transformedMeals)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMealPlans()
  }, [currentWeek])

  function getWeekDates() {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 is Sunday, 1 is Monday, etc.
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Adjust to get Monday

    const monday = new Date(today.setDate(diff))
    const weekDates = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }

    return weekDates
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  function handlePreviousWeek() {
    setCurrentWeek((prevWeek) => {
      const newWeek = prevWeek.map((date) => {
        const newDate = new Date(date)
        newDate.setDate(date.getDate() - 7)
        return newDate
      })
      return newWeek
    })
  }

  function handleNextWeek() {
    setCurrentWeek((prevWeek) => {
      const newWeek = prevWeek.map((date) => {
        const newDate = new Date(date)
        newDate.setDate(date.getDate() + 7)
        return newDate
      })
      return newWeek
    })
  }

  async function handleAddMeal(mealData) {
    try {
      // First create the meal
      const mealResponse = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      })

      if (!mealResponse.ok) {
        throw new Error("Failed to create meal")
      }

      const { meal } = await mealResponse.json()

      // Then add it to the meal plan
      const weekStartDate = currentWeek[0].toISOString().split("T")[0]

      // Check if we already have a meal plan for this day
      const planResponse = await fetch(`/api/meal-plans/day/${mealData.day}/${weekStartDate}`)
      const planData = await planResponse.json()

      if (planData.mealPlan) {
        // Add meal to existing plan
        await fetch(`/api/meal-plans/${planData.mealPlan._id}/meals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mealId: meal._id }),
        })
      } else {
        // Create new plan with this meal
        await fetch("/api/meal-plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: mealData.day,
            weekStartDate,
            meals: [meal._id],
          }),
        })
      }

      // Add the new meal to our state
      const newMeal = {
        id: meal._id,
        ...mealData,
      }

      setMeals((prevMeals) => [...prevMeals, newMeal])
      setShowMealForm(false)
    } catch (error) {
      console.error("Error adding meal:", error)
      // Optionally add error handling UI
    }
  }

  async function handleEditMeal(mealData) {
    try {
      const response = await fetch(`/api/meals/${editingMeal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      })

      if (!response.ok) {
        throw new Error("Failed to update meal")
      }

      const { meal } = await response.json()

      // Update the meal in our state
      setMeals((prevMeals) => prevMeals.map((m) => (m.id === editingMeal.id ? { ...m, ...mealData } : m)))

      setEditingMeal(null)
      setShowMealForm(false)
    } catch (error) {
      console.error("Error updating meal:", error)
      // Optionally add error handling UI
    }
  }

  async function handleDeleteMeal(mealId) {
    try {
      const response = await fetch(`/api/meals/${mealId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete meal")
      }

      // Remove the meal from our state
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== mealId))
    } catch (error) {
      console.error("Error deleting meal:", error)
      // Optionally add error handling UI
    }
  }

  function handleSaveMeal(mealData) {
    if (editingMeal) {
      // Update existing meal
      handleEditMeal(mealData)
    } else {
      // Add new meal
      handleAddMeal(mealData)
    }
    setShowMealForm(false)
  }

  function handleViewMealDetail(meal) {
    setSelectedMeal(meal)
    setShowMealDetail(true)
  }

  // Filter meals by selected day
  const filteredMeals = meals.filter((meal) => meal.day === selectedDay)

  // Calculate daily nutrition totals
  const dailyNutrition = {
    calories: filteredMeals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: filteredMeals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: filteredMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: filteredMeals.reduce((sum, meal) => sum + meal.fat, 0),
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center text-[13px] font-medium text-gray-700 hover:text-violet-600 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Profile
        </button>
      </div>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 mb-4">Meal Planner</h1>

      {/* Navigation tabs */}
      <div className="flex overflow-x-auto mb-5 pb-1 border-b">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center px-3 py-2 mr-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${
              isActive(item.path) ? "bg-violet-600 text-white shadow-[13px]" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="mr-1.5 h-3.5 w-3.5" />
            {item.name}
          </button>
        ))}
      </div>

      {/* Week selector */}
      <div className="flex justify-between items-center mb-4 bg-white shadow-[13px] rounded-md p-3 border border-gray-200">
        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-md" onClick={handlePreviousWeek}>
          <ChevronLeft size={16} />
        </button>
        <div className="text-[13px] font-medium flex items-center">
          <Calendar size={14} className="mr-1.5 text-violet-600" />
          {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
        </div>
        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-md" onClick={handleNextWeek}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Days of week tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {daysOfWeek.map((day, index) => (
          <button
            key={day}
            className={`px-3 py-2 text-[13px] ${
              selectedDay === day
                ? "border-b-2 border-violet-600 text-violet-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setSelectedDay(day)}
          >
            <div>{day.substring(0, 3)}</div>
            <div className="text-[10px] text-gray-500">{formatDate(currentWeek[index])}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meal list */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[13px] font-medium text-gray-700">Meals for {selectedDay}</h2>
              <button
                className="flex items-center bg-violet-600 text-white px-2.5 py-1 text-[13px] rounded-md hover:bg-violet-700 transition-colors shadow-[13px]"
                onClick={() => {
                  setEditingMeal(null)
                  setShowMealForm(true)
                }}
              >
                <Plus size={14} className="mr-1" /> Add Meal
              </button>
            </div>
            {filteredMeals.length === 0 ? (
              <div className="bg-gray-50 p-3 text-[13px] text-gray-500 text-center rounded-md">
                No meals planned for this day. Click "Add Meal" to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMeals
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((meal) => (
                    <div
                      key={meal.id}
                      className="border bg-white p-3 shadow-[13px] rounded-md cursor-pointer hover:border-violet-200"
                      onClick={() => handleViewMealDetail(meal)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[13px] font-medium text-gray-900">{meal.name}</h3>
                          <div className="flex items-center text-[10px] text-gray-500 mt-1">
                            <Clock size={12} className="mr-1" />
                            {meal.time}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            className="p-1 text-gray-500 hover:text-violet-600 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingMeal(meal)
                              setShowMealForm(true)
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:text-red-600 rounded-md"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteMeal(meal.id)
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex text-[10px] space-x-3 text-gray-600">
                        <span>{meal.calories} cal</span>
                        <span>{meal.protein}g protein</span>
                        <span>{meal.carbs}g carbs</span>
                        <span>{meal.fat}g fat</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Nutrition summary */}
        <div>
          <NutritionSummary nutrition={dailyNutrition} day={selectedDay} />
          <div className="mt-4">
            <button
              onClick={() => navigate("/mealtracker")}
              className="w-full flex items-center justify-center bg-white border border-gray-200 text-violet-600 px-3 py-2 text-[13px] rounded-md hover:bg-gray-50 transition-colors shadow-[13px]"
            >
              <Utensils size={14} className="mr-1.5" />
              Go to Meal Tracker
            </button>
          </div>
        </div>
      </div>

      {/* Meal form modal */}
      {showMealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-md">
            <MealForm
              meal={editingMeal}
              onSave={handleSaveMeal}
              onCancel={() => setShowMealForm(false)}
              selectedDay={selectedDay}
            />
          </div>
        </div>
      )}

      {/* Meal detail modal */}
      {showMealDetail && selectedMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[13px] font-medium">{selectedMeal.name}</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMealDetail(false)}>
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-[13px] text-gray-600">
                <Calendar size={14} className="mr-2" />
                {selectedMeal.day}
              </div>
              <div className="flex items-center text-[13px] text-gray-600">
                <Clock size={14} className="mr-2" />
                {selectedMeal.time}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-[10px] text-gray-500">Calories</div>
                  <div className="text-[13px] font-medium">{selectedMeal.calories}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-[10px] text-gray-500">Protein</div>
                  <div className="text-[13px] font-medium">{selectedMeal.protein}g</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-[10px] text-gray-500">Carbs</div>
                  <div className="text-[13px] font-medium">{selectedMeal.carbs}g</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-[10px] text-gray-500">Fat</div>
                  <div className="text-[13px] font-medium">{selectedMeal.fat}g</div>
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-medium mb-1">Ingredients</h3>
                <ul className="list-disc list-inside text-[13px] text-gray-600 space-y-1">
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {selectedMeal.notes && (
                <div>
                  <h3 className="text-[13px] font-medium mb-1">Notes</h3>
                  <p className="text-[13px] text-gray-600">{selectedMeal.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  className="border px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors rounded-md"
                  onClick={() => {
                    setShowMealDetail(false)
                    setEditingMeal(selectedMeal)
                    setShowMealForm(true)
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px] rounded-md"
                  onClick={() => setShowMealDetail(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
