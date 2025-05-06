"use client"

import { Calendar, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

export default function MealHistory({ mealHistory, loading, recommendedProtein }) {
  const [expandedDay, setExpandedDay] = useState(null)

  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md p-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Sort meal history by date (newest first)
  const sortedMealHistory = [...mealHistory].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  const toggleDay = (date) => {
    if (expandedDay === date) {
      setExpandedDay(null)
    } else {
      setExpandedDay(date)
    }
  }

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Calculate protein status for a day
  const getProteinStatus = (meals) => {
    if (!recommendedProtein) return "unknown"

    const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0)

    if (totalProtein >= recommendedProtein * 0.9 && totalProtein <= recommendedProtein * 1.5) {
      return "optimal"
    } else if (totalProtein < recommendedProtein * 0.9) {
      return "low"
    } else {
      return "high"
    }
  }

  // Calculate completion status for a day
  const getCompletionStatus = (meals) => {
    if (meals.length === 0) return "none"

    const completedMeals = meals.filter((meal) => meal.completed).length
    const completionRate = completedMeals / meals.length

    if (completionRate === 1) return "complete"
    if (completionRate >= 0.5) return "partial"
    return "low"
  }

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-violet-600 mr-2" />
          <h2 className="text-[13px] font-medium text-gray-900">Meal History</h2>
        </div>
      </div>

      {sortedMealHistory.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-[13px] text-gray-500">No meal history available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedMealHistory.map((dayLog) => {
            const proteinStatus = getProteinStatus(dayLog.meals)
            const completionStatus = getCompletionStatus(dayLog.meals)
            const totalProtein = dayLog.meals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
            const totalCalories = dayLog.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
            const completedMeals = dayLog.meals.filter((meal) => meal.completed).length

            return (
              <div key={dayLog.date} className="border rounded-md overflow-hidden">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleDay(dayLog.date)}
                >
                  <div className="flex items-center">
                    {completionStatus === "complete" ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : completionStatus === "partial" ? (
                      <CheckCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <div>
                      <p className="text-[13px] font-medium">{formatDate(dayLog.date)}</p>
                      <p className="text-[11px] text-gray-500">
                        {completedMeals} of {dayLog.meals.length} meals completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-3 text-right">
                      <p
                        className={`text-[13px] font-medium ${
                          proteinStatus === "optimal"
                            ? "text-green-600"
                            : proteinStatus === "low"
                              ? "text-amber-600"
                              : proteinStatus === "high"
                                ? "text-blue-600"
                                : "text-gray-600"
                        }`}
                      >
                        {totalProtein}g protein
                      </p>
                      <p className="text-[11px] text-gray-500">{totalCalories} calories</p>
                    </div>
                    {expandedDay === dayLog.date ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedDay === dayLog.date && (
                  <div className="border-t p-3 bg-gray-50">
                    {/* Protein status indicator */}
                    {recommendedProtein > 0 && (
                      <div
                        className={`mb-3 p-2 rounded-md text-[13px] ${
                          proteinStatus === "optimal"
                            ? "bg-green-100 text-green-800"
                            : proteinStatus === "low"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {proteinStatus === "optimal" ? (
                          <p>Proper protein intake for the day.</p>
                        ) : proteinStatus === "low" ? (
                          <p>
                            Low protein intake. Recommended: {recommendedProtein}g, Consumed: {totalProtein}g
                          </p>
                        ) : (
                          <p>Higher than recommended protein intake. This may be appropriate if you're very active.</p>
                        )}
                      </div>
                    )}

                    {/* Meals list */}
                    <div className="space-y-2">
                      {dayLog.meals.map((meal, index) => (
                        <div key={index} className={`p-2 rounded-md ${meal.completed ? "bg-white" : "bg-gray-100"}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[13px] font-medium">{meal.name}</p>
                              <p className="text-[11px] text-gray-500">{meal.time}</p>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full ${
                                  meal.completed ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {meal.completed ? "Completed" : "Not completed"}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 grid grid-cols-4 gap-1 text-[11px] text-gray-600">
                            <div>
                              <p className="font-medium">{meal.calories || 0}</p>
                              <p>calories</p>
                            </div>
                            <div>
                              <p className="font-medium">{meal.protein || 0}g</p>
                              <p>protein</p>
                            </div>
                            <div>
                              <p className="font-medium">{meal.carbs || 0}g</p>
                              <p>carbs</p>
                            </div>
                            <div>
                              <p className="font-medium">{meal.fat || 0}g</p>
                              <p>fat</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
