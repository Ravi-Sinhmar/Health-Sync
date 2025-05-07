"use client"

import { useState } from "react"
import { RecoilRoot } from "recoil"
import WorkoutDashboard from "./WorkDashboard"
import ActiveWorkout from "./ActiveWorkout"
import ExerciseLibrary from "./ExerciseLibrary"
import WorkoutHistory from "./WorkHistory"
import CreateWorkout from "./CreateWork"

export default function WorkoutApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleWorkoutCreated = () => {
    setActiveTab("active")
  }

  return (
    <RecoilRoot>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex space-x-1">
            <button
              className={`flex items-center px-3 py-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-violet-600 text-white shadow-[13px]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`flex items-center px-3 py-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${
                activeTab === "active" 
                  ? "bg-violet-600 text-white shadow-[13px]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active Workout
            </button>
            <button
              className={`flex items-center px-3 py-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${
                activeTab === "exercises" 
                  ? "bg-violet-600 text-white shadow-[13px]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("exercises")}
            >
              Exercises
            </button>
            <button
              className={`flex items-center px-3 py-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${
                activeTab === "history" 
                  ? "bg-violet-600 text-white shadow-[13px]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`flex items-center px-3 py-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${
                activeTab === "create" 
                  ? "bg-violet-600 text-white shadow-[13px]" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create
            </button>
          </div>
        </div>

        {activeTab === "dashboard" && <WorkoutDashboard />}
        {activeTab === "active" && <ActiveWorkout />}
        {activeTab === "exercises" && <ExerciseLibrary />}
        {activeTab === "history" && <WorkoutHistory />}
        {activeTab === "create" && <CreateWorkout onWorkoutCreated={handleWorkoutCreated} />}
      </div>
    </RecoilRoot>
  )
}