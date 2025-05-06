"use client"
import { ArrowLeft, Calculator, Calendar, Utensils } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import apiConfig from "../config/api"
import StudentProfile from "../components/studentDashboard/student-profile"
import PersonalDetails from "../components/studentDashboard/personal-details"
import VitalSigns from "../components/studentDashboard/vital-signs"
import HealthMetrics from "../components/studentDashboard/health-metrics"
import MealStatistics from "../components/studentDashboard/meal-statistics"
import ProteinAnalysis from "../components/studentDashboard/protein-analysis"
import MealHistory from "../components/studentDashboard/meal-history"
import toast from "react-hot-toast"

export default function StudentHealthDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation items for health features
  const navItems = [
    { name: "Protein Calculator", path: "/meal/protein/calculator", icon: Calculator },
    { name: "Meal Planner", path: "/meal/planner", icon: Calendar },
    { name: "Meal Tracker", path: "/meal/tracker", icon: Utensils },
  ]

  // Function to check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path
  }

  // State for health metrics and profile data
  const [healthMetrics, setHealthMetrics] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for meal history and statistics
  const [mealHistory, setMealHistory] = useState([])
  const [mealStats, setMealStats] = useState({
    totalDays: 0,
    completedDays: 0,
    averageProtein: 0,
    recommendedProtein: 0,
    lowProteinDays: 0,
  })
  const [mealHistoryLoading, setMealHistoryLoading] = useState(true)

  // Fetch health metrics
  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiConfig.baseURL}/api/health-metrics`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch health metrics")
        }

        const data = await response.json()
        setHealthMetrics(data.healthMetrics)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthMetrics()
  }, [])

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${apiConfig.baseURL}/students/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchProfileData()
  }, [])

  // Fetch meal history and calculate statistics
  useEffect(() => {
    const fetchMealHistory = async () => {
      try {
        setMealHistoryLoading(true)

        // Get the date for 30 days ago
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const startDate = thirtyDaysAgo.toISOString().split("T")[0]
        const endDate = new Date().toISOString().split("T")[0]

        const response = await fetch(
          `${apiConfig.baseURL}/api/meal-logs/date-range?startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        )

        if (!response.ok) {
          throw new Error("Failed to fetch meal history")
        }

        const data = await response.json()

        // Process meal logs to calculate statistics
        const mealLogs = data.mealLogs || []
        setMealHistory(mealLogs)

        // Calculate recommended protein based on weight (if available)
        let recommendedProtein = 0
        if (profileData?.weight) {
          // Basic calculation: 0.8g per kg of body weight
          recommendedProtein = Math.round(profileData.weight * 0.8)
        }

        // Calculate statistics
        const totalDays = mealLogs.length
        let completedDays = 0
        let totalProtein = 0
        let lowProteinDays = 0

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

        setMealStats({
          totalDays,
          completedDays,
          averageProtein: totalDays > 0 ? Math.round(totalProtein / totalDays) : 0,
          recommendedProtein,
          lowProteinDays,
        })
      } catch (error) {
        console.error("Error fetching meal history:", error)
        toast.error("Failed to load meal history")
      } finally {
        setMealHistoryLoading(false)
      }
    }

    // Only fetch meal history if profile data is loaded (for protein calculation)
    if (profileData) {
      fetchMealHistory()
    }
  }, [profileData])

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

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Student info */}
        <div className="lg:col-span-1 space-y-4">
          <StudentProfile data={profileData} loading={loading} />
          <PersonalDetails data={profileData} loading={loading} />
        </div>

        {/* Middle column - Health metrics */}
        <div className="lg:col-span-1 space-y-4">
          <VitalSigns data={healthMetrics} loading={loading} />
          <HealthMetrics data={healthMetrics} loading={loading} error={error} />
        </div>

        {/* Right column - Meal statistics */}
        <div className="lg:col-span-1 space-y-4">
          <MealStatistics stats={mealStats} loading={mealHistoryLoading} />
          <ProteinAnalysis
            recommendedProtein={mealStats.recommendedProtein}
            averageProtein={mealStats.averageProtein}
            loading={mealHistoryLoading}
            weight={profileData?.weight}
          />
        </div>
      </div>

      {/* Meal history section - Full width */}
      <div className="mt-4">
        <MealHistory
          mealHistory={mealHistory}
          loading={mealHistoryLoading}
          recommendedProtein={mealStats.recommendedProtein}
        />
      </div>
    </div>
  )
}
