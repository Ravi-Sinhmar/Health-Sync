"use client"

import { useState } from "react"
import apiConfig from "../config/api"
import { ArrowLeft, Calculator, Calendar, Utensils, Activity } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function ProteinCalculator() {
  const navigate = useNavigate()
  const location = useLocation()
  const [weight, setWeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [goal, setGoal] = useState("maintain")
  const [result, setResult] = useState(null)

  // Navigation items for health features
  const navItems = [
    { name: "Health Dashboard", path: "/dashboard", icon: Activity },
    { name: "Meal Planner", path: "/meal/planner", icon: Calendar },
    { name: "Meal Tracker", path: "/meal/tracker", icon: Utensils },
  ]

  // Function to check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  const calculateProtein = async () => {
    if (!weight) return

    try {
      const response = await fetch(`${apiConfig.baseURL}/api/health-metrics/calculate-protein`, {
        
          credentials: "include",
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: Number.parseFloat(weight),
          activityLevel,
          goal,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to calculate protein requirements")
      }

      const data = await response.json()
      setResult(data.proteinRequirement)
    } catch (error) {
      console.error("Error calculating protein:", error)
      // Optionally add error state and display to user
    }
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

      {/* Calculator content */}
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 max-w-xl mx-auto">
        <div className="flex items-center mb-4">
          <Calculator className="h-4 w-4 text-violet-600 mr-2" />
          <h2 className="text-[13px] font-medium text-gray-900">Calculate Your Daily Protein Needs</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="weight" className="block text-[13px] font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border rounded-md p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Enter your weight"
            />
          </div>

          <div>
            <label htmlFor="activity" className="block text-[13px] font-medium text-gray-700 mb-1">
              Activity Level
            </label>
            <select
              id="activity"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full border rounded-md p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="very-active">Very Active (intense exercise daily)</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="block text-[13px] font-medium text-gray-700 mb-1">
              Fitness Goal
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full border rounded-md p-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Muscle</option>
            </select>
          </div>

          <button
            onClick={calculateProtein}
            className="w-full bg-violet-600 text-white py-2 rounded-md text-[13px] hover:bg-violet-700 transition-colors shadow-[13px]"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
              <p className="text-[13px] text-gray-500 mb-1">Your Daily Protein Requirement</p>
              <p className="text-xl font-semibold text-violet-600">{result} grams</p>
              <p className="text-[13px] text-gray-500 mt-2">
                This is an estimate based on your weight, activity level, and goals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
