"use client"

import { Utensils, Filter, PlusCircle, Check } from "lucide-react"
import { Link } from "react-router-dom"

export default function MealTracker({
  meals,
  loading,
  selectedDate,
  setSelectedDate,
  showFilter,
  setShowFilter,
  toggleMealCompletion,
}) {
  // Calculate total nutrition for the day
  const calculateDailyTotals = () => {
    return meals.reduce(
      (totals, meal) => {
        return {
          calories: totals.calories + (meal.calories || 0),
          protein: totals.protein + (meal.protein || 0),
          carbs: totals.carbs + (meal.carbs || 0),
          fat: totals.fat + (meal.fat || 0),
        }
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  const dailyTotals = calculateDailyTotals()

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Utensils className="h-4 w-4 text-violet-600 mr-2" />
          <h2 className="text-[13px] font-medium text-gray-900">Daily Meals</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="text-[13px] text-violet-600 hover:text-violet-700 font-medium flex items-center mr-3"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filter
          </button>
          <Link
            to="/meal/add"
            className="text-[13px] text-violet-600 hover:text-violet-700 font-medium flex items-center"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Add Meal
          </Link>
        </div>
      </div>

      {showFilter && (
        <div className="p-3 mb-3 border rounded-md bg-gray-50">
          <label className="block text-[13px] text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 text-[13px] border rounded-md"
          />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-md border border-gray-200 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-6 border rounded-md">
          <p className="text-[13px] text-gray-500 mb-3">No meals recorded for this date</p>
          <Link
            to="/meal/add"
            className="inline-flex items-center px-3 py-1.5 bg-violet-600 text-white text-[13px] font-medium rounded-md hover:bg-violet-700 transition-colors"
          >
            <PlusCircle className="size-3.5 mr-1.5" />
            Add Meal
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className={`p-3 rounded-md border ${meal.completed ? "border-emerald-200 bg-emerald-50" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[13px] font-medium text-gray-800">{meal.name}</h4>
                    <p className="text-[12px] text-gray-500">{meal.time}</p>
                  </div>
                  <button
                    onClick={() => toggleMealCompletion(meal._id, meal.completed)}
                    className={`px-2 py-1 text-[11px] rounded-full flex items-center ${
                      meal.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700"
                    }`}
                  >
                    {meal.completed && <Check className="h-3 w-3 mr-1" />}
                    {meal.completed ? "Completed" : "Mark Complete"}
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-[11px] text-gray-600">
                  <div>
                    <p className="font-medium">{meal.calories}</p>
                    <p>calories</p>
                  </div>
                  <div>
                    <p className="font-medium">{meal.protein}g</p>
                    <p>protein</p>
                  </div>
                  <div>
                    <p className="font-medium">{meal.carbs}g</p>
                    <p>carbs</p>
                  </div>
                  <div>
                    <p className="font-medium">{meal.fat}g</p>
                    <p>fat</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Daily nutrition summary */}
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-[13px] font-medium text-gray-700 mb-3">Daily Totals</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-violet-50 p-2 rounded-md text-center">
                <p className="text-[13px] font-medium text-violet-800">{dailyTotals.calories}</p>
                <p className="text-[11px] text-violet-600">calories</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-md text-center">
                <p className="text-[13px] font-medium text-emerald-800">{dailyTotals.protein}g</p>
                <p className="text-[11px] text-emerald-600">protein</p>
              </div>
              <div className="bg-amber-50 p-2 rounded-md text-center">
                <p className="text-[13px] font-medium text-amber-800">{dailyTotals.carbs}g</p>
                <p className="text-[11px] text-amber-600">carbs</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-md text-center">
                <p className="text-[13px] font-medium text-blue-800">{dailyTotals.fat}g</p>
                <p className="text-[11px] text-blue-600">fat</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
