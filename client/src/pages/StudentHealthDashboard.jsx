"use client"
import { ArrowLeft, Calculator, Calendar, Utensils } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import StudentProfile from "../components/studentDashboard/student-profile"
import PersonalDetails from "../components/studentDashboard/personal-details"
import VitalSigns from "../components/studentDashboard/vital-signs"
import HealthMetrics from "../components/studentDashboard/health-metrics"
import { useEffect, useState } from "react"
import CheckupHistory from "../components/studentDashboard/checkup-history"

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

  const [healthMetrics, setHealthMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHealthMetrics = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/health-metrics")

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
      <div className="space-y-4">
        <StudentProfile />
        <PersonalDetails />
        <VitalSigns />
        <CheckupHistory />
        <HealthMetrics data={healthMetrics} loading={loading} error={error} />
      </div>
    </div>
  )
}
